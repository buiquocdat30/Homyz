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
        //userEmail, bỏ đi vì nó Prisma báo lỗi do đây là foreign key
        owner: { connect: { email: userEmail } },
      },
    });

    res
      .status(201)
      .json({ message: "residency created sucessfully", residency });
  } catch (err) {
    console.error("Error:", err);
    if (err.code === "P2002") {
      return res
        .status(400)
        .json({ message: "A residency with this address already exists" });
    }

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

export const getAllResidencies = asyncHandler(async (req, res) => {
  try {
    const residencies = await prisma.residency.findMany({
      orderBy: {
        createAt: "desc",
      },
    });
    res.status(200).json(residencies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});
