import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

const f = createUploadthing();

const authAdmin = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return { userId: session.user.id };
};

export const ourFileRouter = {
  ktaImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 2 },
  }).onUploadComplete(({ file }) => {
    return { url: file.url };
  }),

  cmsImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(authAdmin)
    .onUploadComplete(({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
