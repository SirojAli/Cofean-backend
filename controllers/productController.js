const assert = require("assert");
const Definer = require("../lib/mistake");
const Product = require("../models/Product");
const ProductSchema = require("../schema/product.model");

let productController = module.exports;

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);
    res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};

// productController.getChosenProduct = async (req, res) => {
//   try {
//     console.log("GET: cont/getChosenProduct");

//     const product = new Product();
//     const id = req.params.id;
//     const result = await product.getChosenProductData(req.member, id);

//     res.json({ state: "succeed", data: result });
//   } catch (err) {
//     console.log(`ERROR, cont/getChosenProduct, ${err.message} `);
//     res.json({ state: "failed", message: err.message });
//   }
// };
productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");

    const productId = req.params.id;

    // Use getChosenProductData to fetch additional product details
    const product = new Product();
    const result = await product.getChosenProductData(req.member, productId);

    if (!result) {
      throw new Error("Product not found");
    }

    // Populate cafe_mb_id from ProductSchema
    await ProductSchema.populate(result, {
      path: "cafe_mb_id",
      select:
        "mb_nick mb_phone mb_address mb_description mb_image mb_point mb_top mb_views mb_likes mb_follow_count mb_subscriber_count",
    });

    console.log("Product details:", result);
    res.json({ state: "succeed", data: result });
  } catch (err) {
    console.error(`ERROR, cont/getChosenProduct, ${err.message}`);
    res.status(500).json({ state: "failed", message: err.message });
  }
};
// productController.getChosenProduct = async (req, res) => {
//   try {
//     console.log("GET: cont/getChosenProduct");
//     const productId = req.params.id;
//     const result = await ProductSchema.findOne({ _id: productId }).populate(
//       "cafe_mb_id",
//       "mb_nick mb_phone mb_address mb_description mb_image mb_point mb_top mb_views mb_likes mb_follow_count mb_subscriber_count"
//     );
//     console.log("cafe_mb_id>>>", result.cafe_mb_id);
//     res.json({ state: "succeed", data: result });
//   } catch (err) {
//     console.log(`ERROR, cont/getChosenProduct, ${err.message} `);
//     res.json({ state: "failed", message: err.message });
//   }
// };

/*******************************
 *     BSSR RELATED METHODS    *
 ******************************/

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert(req.files, Definer.general_err3);

    const product = new Product();
    let data = req.body;
    data.product_images = req.files.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    console.log("Product Allergy:", data.product_allergy);
    const newProductData = {
      product_name: data.product_name,
      product_price: data.product_price,
      product_collection: data.product_collection,
      product_description: data.product_description,
      product_status: data.product_status,
      product_discount: data.product_discount || 0,
      product_allergy: data.product_allergy || "-",
      product_calories: data.product_calories || 0,
      product_caffeine: data.product_caffeine || 0,
      product_sugar: data.product_sugar || 0,
      product_protein: data.product_protein || 0,
      product_saturated_fat: data.product_saturated_fat || 0,
      product_sodium: data.product_sodium || 0,
      product_images: data.product_images,
    };

    console.log("New Product Data:", newProductData);

    const savedProduct = await product.addNewProductData(
      newProductData,
      req.member
    );

    const html = `<script>
                    alert("new product ${data.product_name} added successfully");
                    window.location.replace('/cafe/products/menu');
                  </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct, ${err.message} `);
    res.status(500).send(err.message);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");

    const product = new Product();
    const id = req.params.id;
    const result = await product.updateChosenProductData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenProduct, ${err.message} `);
    res.json({ state: "failed", message: err.message });
  }
};
