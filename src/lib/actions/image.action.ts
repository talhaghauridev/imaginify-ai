"use server";
import { revalidatePath } from "next/cache";
import Image from "../database/models/image.model";
import User from "../database/models/user.model";
import { handleError } from "../utils";
import { connectToDatabase } from "../database/mongoose";
import { redirect } from "next/navigation";

export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);
    if (!author) throw new Error("User not found");
    const newIamge = await Image.create({
      ...image,
      author: author._id,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newIamge));
  } catch (error) {
    handleError(error);
  }
}

export async function updateImage({ image, userId, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(userId);
    if (!imageToUpdate || imageToUpdate.author._id.toHexString() !== userId)
      throw new Error("Unauthorized and Image not found");

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteImage(imageId: string) {
  try {
    await connectToDatabase();
    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}

export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await Image.findById(imageId).populate({
      model: User,
      path: "author",
      select: "_id firstName lastName",
    });
    if (!image) {
      throw new Error("Image not found");
    }
    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}
