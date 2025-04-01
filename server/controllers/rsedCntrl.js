import asyncHandler from "express-async-handler";

import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  console.log("Endpoint created");
  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    facilities,
    userEmail,
  } = req.body.data;

  console.log(req.body.data);

  try {
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price,
        address,
        city,
        country,
        image,
        facilities,
        //userEmail, bỏ đi vì nó là  Prisma báo lỗi do đây là foreign key
        owner: { connect: { email: userEmail } },
      },
    });

    res.status(201).json({ message: "residency created sucessfully" , residency});
  } catch (err) {
    console.error("Error:", err);
    if (err.code === "P2002") {
      //   throw new Error("A residency with address already there");
      return res
        .status(400)
        .json({ message: "A residency with this address already exists" });
    }
    // throw new Error(err.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});
