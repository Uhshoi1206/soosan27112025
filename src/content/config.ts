import { defineCollection, z } from 'astro:content';

// Product Categories Collection Schema
const categoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    isHidden: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

// Blog Categories Collection Schema
const blogCategoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    isHidden: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

// Products Collection Schema
const productsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // Basic Information
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    brand: z.union([z.string(), z.array(z.string())]),
    type: z.string(), // category key

    // Pricing
    price: z.number().nullable().optional(),
    priceText: z.string().optional(),

    // Dimensions & Weight
    weightText: z.string(),
    weight: z.number(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
    dimensions: z.string(),

    // Images
    thumbnailUrl: z.string(),
    images: z.array(z.string()),

    // Status Flags
    isNew: z.boolean().optional(),
    isHot: z.boolean().optional(),
    isHidden: z.boolean().default(false),
    origin: z.string().optional(),

    // Descriptions
    description: z.string().optional(),
    detailedDescription: z.string().optional(),
    features: z.array(z.string()).optional(),

    // Engine Specifications
    engineModel: z.string().optional(),
    engineCapacity: z.string().optional(),
    enginePower: z.string().optional(),
    engineTorque: z.string().optional(),
    emissionStandard: z.string().optional(),
    engineType: z.string().optional(),
    fuel: z.string().optional(),

    // Transmission & Drivetrain
    transmission: z.string().optional(),
    transmissionType: z.string().optional(),
    clutchType: z.string().optional(),

    // Dimensions Details
    wheelbase: z.number().optional(),
    wheelbaseText: z.string().optional(),
    insideDimension: z.string().optional(),
    groundClearance: z.number().optional(),
    wheelTrack: z.string().optional(),
    turningRadius: z.number().optional(),

    // Weight Details
    grossWeight: z.string().optional(),
    kerbWeight: z.string().optional(),
    frontAxleLoad: z.string().optional(),
    rearAxleLoad: z.string().optional(),

    // Performance
    maxSpeed: z.string().optional(),
    climbingAbility: z.string().optional(),
    fuelConsumption: z.string().optional(),

    // Chassis & Suspension
    chassisMaterial: z.string().optional(),
    frontSuspension: z.string().optional(),
    rearSuspension: z.string().optional(),
    suspensionType: z.string().optional(),

    // Braking System
    brakeSystem: z.string().optional(),
    frontBrake: z.string().optional(),
    rearBrake: z.string().optional(),
    parkingBrake: z.string().optional(),
    brakingSystem: z.string().optional(),

    // Steering & Tires
    steeringSystem: z.string().optional(),
    steeringType: z.string().optional(),
    tires: z.string().optional(),

    // Cabin
    cabinType: z.string().optional(),
    seats: z.number().optional(),
    cabinFeatures: z.array(z.string()).optional(),

    // Vehicle Types
    boxType: z.enum(['đông-lạnh', 'bảo-ôn', 'kín', 'bạt', 'lửng', 'xi-téc']).optional(),
    craneType: z.enum(['cẩu-rời', 'cẩu-gắn-xe']).optional(),
    trailerType: z.enum(['ben', 'sàn', 'sàn-rút', 'lùn', 'cổ-cò', 'xương', 'lửng', 'rào', 'xi-téc', 'bồn-xi-măng', 'bồn-sắt', 'bồn-bột-mì']).optional(),

    // Specialized Specs (stored as JSON strings for flexibility)
    coolingBox: z.record(z.any()).optional(),
    insulatedBox: z.record(z.any()).optional(),
    closedBox: z.record(z.any()).optional(),
    tarpaulinBox: z.record(z.any()).optional(),
    flatbedBox: z.record(z.any()).optional(),
    tankSpec: z.record(z.any()).optional(),
    craneSpec: z.record(z.any()).optional(),
    trailerSpec: z.record(z.any()).optional(),
    tractorSpec: z.record(z.any()).optional(),

    // Additional specs
    specifications: z.record(z.any()).optional(),

    // Order for sorting
    order: z.number().optional(),
  }),
});

// Blog Posts Collection Schema
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic Information
    id: z.string(),
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),

    // Category - dynamic, loaded from blog-categories collection
    category: z.string(),

    // Images
    images: z.array(z.string()),

    // Meta
    publishDate: z.number(),
    readTime: z.number(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    views: z.number().optional(),
    comments: z.number().optional(),

    // Visibility
    isHidden: z.boolean().default(false),

    // Order for sorting
    order: z.number().optional(),
  }),
});

export const collections = {
  'categories': categoriesCollection,
  'blog-categories': blogCategoriesCollection,
  'products': productsCollection,
  'blog': blogCollection,
};
