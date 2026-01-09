import mongoose from "mongoose";

/**
 * @module GeneralControllers
 * @description Generic controller factory for standard CRUD operations.
 * @author Daniel Arapé
 */

/**
 * Creates a new document in the database.
 * @param {import('mongoose').Model} Model - The Mongoose model to interact with.
 * @returns {Function} Express middleware to handle the request.
 */
export const createDoc = (Model) => async (req, res) => {
  try {
    const newDoc = new Model(req.body);

    if (req.user && Model.schema.path("authorId")) {
      newDoc.authorId = req.user.id;
    }

    await newDoc.save();

    res.status(201).json({
      success: true,
      message: `${Model.modelName} created successfully`,
      data: newDoc,
    });
  } catch (error) {
    const statusCode = error.name === "ValidationError" ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Retrieves a paginated list of documents based on query filters.
 * Supports partial string search (regex) and exact matches for IDs/Numbers.
 * @param {import('mongoose').Model} Model - The Mongoose model to interact with.
 * @returns {Function} Express middleware to handle the request.
 */
export const getAll = (Model) => async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", ...filters } = req.query;
    const query = { deleted: false };

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (
        typeof value === "string" &&
        !mongoose.Types.ObjectId.isValid(value)
      ) {
        query[key] = { $regex: value, $options: "i" };
      } else {
        query[key] = value;
      }
    });

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort]: -1 },
    };

    const docs = await Model.paginate(query, options);

    res.status(200).json({
      success: true,
      count: docs.totalDocs,
      data: docs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Retrieves a single document by its unique ID.
 * Validates that the document is not logically deleted.
 * @param {import('mongoose').Model} Model - The Mongoose model to interact with.
 * @returns {Function} Express middleware to handle the request.
 */
export const getById = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc || doc.deleted) {
      return res.status(404).json({
        success: false,
        message: `${Model.modelName} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: doc,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Performs a logical deletion (Soft Delete) on a document.
 * Sets the 'deleted' flag to true and records the timestamp and author.
 * @param {import('mongoose').Model} Model - The Mongoose model to interact with.
 * @returns {Function} Express middleware to handle the request.
 */
export const softDelete = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Model.findById(id);

    if (!doc || doc.deleted) {
      return res.status(404).json({
        success: false,
        message: `${Model.modelName} not found or already deleted`,
      });
    }

    doc.deleted = true;
    doc.deletedAt = new Date();

    if (req.user) {
      doc.deletedBy = req.user.id;
    }

    await doc.save();

    res.status(200).json({
      success: true,
      message: `${Model.modelName} successfully deleted`,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Updates an existing document while protecting sensitive fields.
 * Only allows modification of non-restricted fields.
 * @param {import('mongoose').Model} Model - The Mongoose model to interact with.
 * @returns {Function} Express middleware to handle the request.
 */
export const updateDoc = (Model) => async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const restrictedFields = [
      "role",
      "tokensBalance",
      "passwordHash",
      "deleted",
      "deletedAt",
      "deletedBy",
      "email",
    ];

    restrictedFields.forEach((field) => {
      delete updateData[field];
    });

    const doc = await Model.findById(id);

    if (!doc || doc.deleted) {
      return res.status(404).json({
        success: false,
        message: `${Model.modelName} not found`,
      });
    }

    Object.assign(doc, updateData);
    await doc.save();

    res.status(200).json({
      success: true,
      message: `${Model.modelName} updated successfully`,
      data: doc,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Invalid ID format",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};