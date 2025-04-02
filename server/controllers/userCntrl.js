import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

//Function create user
export const createUser = asyncHandler(async (req, res) => {
  console.log("Creating a user");

  let { email } = req.body;// Lấy email từ request body

  // Tìm người dùng trong database dựa vào email
  const userExists = await prisma.user.findUnique({ where: { email: email } });

  //Kiểm tra xem user đã được khởi tạo chưa
  if (!userExists) {
    //nếu chưa, khởi tạo user và gửi tin nhắn thành công về
    const user = await prisma.user.create({ data: req.body });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else {
    //còn nếu đã có user, gửi thông báo đã có user
    return res.status(400).json({ message: "User already registered" });
  }
});

//Function to book a visit to resd
export const bookVisit = asyncHandler(async (req, res) => {
  const { email, date } = req.body; // Lấy email và ngày đặt lịch từ request body
  const { id } = req.params; // Lấy id của residency từ request params

  try {
    // Tìm người dùng trong database dựa vào email, chỉ lấy danh sách bookedVisits
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // Kiểm tra nếu không tìm thấy user trong database
    if (!booking) {
      return res.status(404).json({ message: "User not found" });
    }

    //Kiểm tra xem residency đã được đặt bởi user chưa
    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residnecy is already booked by you" });
    } else {
      //Nếu chưa đặt, thêm lịch đặt vào danh sách bookedVisits
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },// Đẩy một object {id, date} vào mảng bookedVisits
        },
      });

      // Trả về phản hồi thành công với mã trạng thái 201 (Created)
      res.status(201).json({ message: "Booking successful", id, date });
    }
  } catch (error) {
    // Bắt lỗi nếu có vấn đề xảy ra
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//function to get all bookings of user
export const allBookings = asyncHandler(async (req, res) => {
  const { email } = req.body; // Lấy email từ request body

  try {
    // Tìm user trong database dựa trên email, chỉ lấy danh sách bookedVisits

    const booking = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // Kiểm tra nếu không tìm thấy user trong database
    if (!booking) {
      return res.status(404).json({ message: "User not found" });
    }

    // Gửi phản hồi thành công, trả về danh sách đặt lịch
    res.status(200).json({ message: "This í all booking of you", booking });
  } catch (error) {
    // Bắt lỗi nếu có vấn đề xảy ra
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

//function to cancel the booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { email } = req.body; // Lấy email từ request body
  const { id } = req.params; // Lấy id của booking từ request params
  try {
    // 1️⃣ Tìm người dùng trong database dựa vào email, chỉ lấy danh sách bookedVisits
    const user = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    // 2️⃣ Tìm vị trí (index) của booking cần hủy trong danh sách bookedVisits
    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    // 3️⃣ Kiểm tra nếu booking không tồn tại
    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      // 4️⃣ Nếu tìm thấy, xóa booking đó khỏi danh sách
      user.bookedVisits.splice(index, 1);
      // 5️⃣ Cập nhật lại dữ liệu trong database
      await prisma.user.update({
        where: { email },
        data: { bookedVisits: user.bookedVisits },
      });
    }

    // 6️⃣ Gửi phản hồi thành công
    res.status(200).json({ message: "Booking canceled successfully" });
  } catch (error) {
    // Bắt lỗi nếu có vấn đề xảy ra
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});
