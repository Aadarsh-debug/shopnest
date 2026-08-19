import Product from "../models/Products.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter);

    if (sort === "price_asc") {
      query = query.sort({ price: 1 });
    } else if (sort === "price_desc") {
      query = query.sort({ price: -1 });
    } else if (sort === "rating_desc") {
      query = query.sort({ ratings: -1 });
    } else if (sort === "newest") {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query.exec();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl: bodyImageUrl, ratings, numReviews } = req.body;
    let imageUrl = bodyImageUrl || "";

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.warn("Cloudinary upload failed, using fallback or default:", uploadError.message);
      }
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price) || 0,
      category: category || "General",
      stock: Number(stock) || 0,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      ratings: Number(ratings) || 4.8,
      numReviews: Number(numReviews) || 12,
    });

    res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.imageUrl = result.secure_url;
      } catch (uploadError) {
        console.warn("Cloudinary upload failed during update:", uploadError.message);
      }
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};