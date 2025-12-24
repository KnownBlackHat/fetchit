import z from "zod";

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string(),
    role: z.enum(["user", "admin", "vendor", "delivery_boy"])
})

const baseSchema = z.object({
    username: z.string(),
    password: z.string(),
    phone_no: z.coerce.number().int().positive().describe("10 digit phone number")
})

const userSchema = baseSchema.extend({
    role: z.literal("user"),
    full_name: z.string(),
    mail_id: z.email(),
    img_url: z.url("Must be valid URL").nullable().optional().default(null),
    gender: z.enum(["Male", "Female"])
})

const adminSchema = baseSchema.extend({
    role: z.literal("admin"),
})

const deliveryBoySchema = baseSchema.extend({
    role: z.literal("delivery_boy"),
    img_url: z.url("Must be valid URL")
})

const vendorSchema = baseSchema.extend({
    role: z.literal("vendor"),
    shop_name: z.string(),
    address: z.string(),
    rating: z.number().min(0).max(5).optional(),
    rating_count: z.number().int().nonnegative().optional(),
    img_url: z.url("Must be valid URL"),
    active: z.boolean().default(true).optional(),
    category: z.enum(["Resturant", "Den", "Ration", "Essential", "Canteen"]),
    total_seat: z.number().int().positive().optional(),
    available_seat: z.number().int().positive().optional(),
    total_revenue: z.number().optional(),
    commission: z.number().optional(),
    avg_order_value: z.number().optional(),
})

export const SignUpSchema = z.discriminatedUnion("role", [
    userSchema,
    adminSchema,
    deliveryBoySchema,
    vendorSchema
])

export type userSignUpPayload = z.infer<typeof userSchema>;
export type adminSignUpPayload = z.infer<typeof adminSchema>;
export type vendorSignUpPayload = z.infer<typeof vendorSchema>;
export type deliveryBoySignUpPayload = z.infer<typeof deliveryBoySchema>;
export type SignUpPayload = z.infer<typeof SignUpSchema>;

export const AddInventorySchema = z.object({
    name: z.string(),
    price: z.number().positive(),
    img_url: z.url("Must be valid URL"),
    rating: z.number().min(0).max(5).optional(),
    rating_count: z.number().int().nonnegative().optional(),
    count: z.number().int().nonnegative(),
});

export const UpdateSeatSchema = z.object({
    available_seat: z.number().int().nonnegative()
});

export const UpdateMetaData = z.object({
    full_name: z.string().optional(),
    profile_image: z.string().optional(),
    phone_no: z.number().optional(),
    mail: z.string().optional(),
    gender: z.string().optional(),
})

export const AddAddress = z.object({
    line_1: z.string(),
    line_2: z.string(),
    landmark: z.string(),
    city: z.string(),
    postal_code: z.number()
})
