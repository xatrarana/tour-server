import JOI from 'joi'

type TPlaceParams = {
      title: string,
      wardno: string,
      description: string,
      location: string,
      latitude: number,
      longitude: number,
      category: string,
      thumbnail: File;
      images: File[];
}

export const PlaceValidationSchema = JOI.object<TPlaceParams>({ 
        title: JOI.string().required().messages({ title: "Title is required" }),
        wardno: JOI.string().required().messages({ wardno: "Ward No is required" }),
        description: JOI.string().required().messages({ description: "Description is required" }),
        location: JOI.string().required().messages({ location: "Location is required" }),
        latitude: JOI.number().required().messages({ latitude: "Latitude is required" }),
        longitude: JOI.number().required().messages({ longitude: "Longitude is required" }),
        category: JOI.string().required().messages({ category: "Category is required" }),
        thumbnail: JOI.any(), // Validate the thumbnail object
        images: JOI.any(), // Validate the thumbnail object
    })

export const PlaceRatingValidationSchema = JOI.object<{stars: number}>({
    stars: JOI.number().min(1).max(5).required().messages({stars: "Stars is required"})
})

export const PartialPlaceUpdateValidationSchema = JOI.object({
    title: JOI.string(),
    wardno: JOI.string(),
    description: JOI.string(),
    location: JOI.string(),
    latitude: JOI.number(),
    longitude: JOI.number(),
    category: JOI.string(),
}).min(1)