const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "50.247.13.10",
  user: "imxApp",
  password: "StanImxApp1",
  database: "imx",
};

const db = mysql.createPool(dbConfig);

const checkUPCInDatabase = async (upcToCheck) => {
  const query =
    // "SELECT itemNo, description, sellPriceCase1, unitsPerCase FROM itemrec WHERE UPC = ?";
    "SELECT itemNo, description, size, pack, UPC, sellPriceCase1, sellPriceUnit, unitsPerCase FROM itemrec WHERE itemNo = ? or UPC= ?";

  const [results] = await db.query(query, [upcToCheck, upcToCheck]);

  const itemsWithImages = await Promise.all(
    results.map(async (item) => {
      const imageBufferExists = await checkImageInDatabase(item.itemNo);
      if (imageBufferExists) {
        item.imageUrl = `http://10.0.0.174:3000/image/${item.itemNo}`;
      }
      return item;
    })
  );
  console.log(itemsWithImages);
  return itemsWithImages;
};

const checkImageInDatabase = async (pictureIdToCheck) => {
  const query = "SELECT thumbnail FROM picturesrec WHERE pictureId = ?";
  const [results] = await db.query(query, [pictureIdToCheck]);
  return results.length > 0 && results[0].thumbnail;
};

// Route to serve image data
app.get("/image/:pictureId", async (req, res) => {
  const { pictureId } = req.params;
  try {
    const query = "SELECT thumbnail FROM picturesrec WHERE pictureId = ?";
    const [results] = await db.query(query, [pictureId]);
    if (results.length > 0 && results[0].thumbnail) {
      res.type("image/bmp");
      res.send(results[0].thumbnail);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving image");
  }
});

app.post("/check-item", async (req, res) => {
  const { UPC } = req.body;
  try {
    const items = await checkUPCInDatabase(UPC);
    if (items.length > 0) {
      res.json(items[0]);
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error querying the database");
  }
});

const checkUserCredentials = async (emailAddress, password) => {
  const query =
    "SELECT emailAddress, password FROM webloginshoprec WHERE emailAddress = ? AND password = ?";

  const [results] = await db.query(query, [emailAddress, password]);
  return results.length > 0;
};

// Login endpoint
app.post("/login", async (req, res) => {
  const { emailAddress, password } = req.body;
  try {
    const userExists = await checkUserCredentials(emailAddress, password);
    if (userExists) {
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error querying the database");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// {
//   "UPC": "609249914026"
// }
