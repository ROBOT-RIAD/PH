import { model, Schema } from "mongoose";
import { IDivition } from "./devision.interface";

const DivisionSchema = new Schema<IDivition>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbail: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

DivisionSchema.pre("save", async function (next) {
  if (this.isModified("naem")) {
    const baseSlug = this.name.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}-division`;

    let counter = 0;
    while (await Division.exists({ slug })) {
      slug = `${slug}-${counter++}`; // dhaka-division-2
    }
    this.slug = slug;
  }
  next();
});

DivisionSchema.pre("findOneAndUpdate", async function (next) {
  const division = this.getUpdate() as IDivition;
  if (division.name) {
        const baseSlug = division.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`

        let counter = 0;
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}` // dhaka-division-2
        }

        division.slug = slug
    }
    this.setUpdate(division)
  next();
});

export const Division = model<IDivition>("Division", DivisionSchema);
