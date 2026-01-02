import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pricingSchema } from "@/schema/course.price.schema";
import type { PricingFormData } from "@/schema/course.price.schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { useCourseUpdatePrice } from "@/hooks/shared/course.update.price";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function CoursePricingForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      isFree: true,
      price: 0,
      discount: 0,
      status: "draft",
    },
  });
  const updatePriceMutation = useCourseUpdatePrice();
  const courseId = useSelector((state: RootState) => state.courseDetails.id);
  const isFree = watch("isFree");
  const price = watch("price");
  const discount = watch("discount");

  const discountAmount = isFree ? 0 : (price * discount) / 100;
  const total = isFree ? 0 : Math.max(price - discountAmount, 0);

  const onSubmit = async (data: PricingFormData) => {
    await updatePriceMutation.mutateAsync({
      courseId: courseId,
      payload: {
        type: data.isFree ? "Free" : "Paid",
        price: data.price,
        discount: data.discount,
        status: data.status,
      },
    });
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Course Type */}
          <div className="space-y-2">
            <Label>Course Type</Label>
            <RadioGroup
              defaultValue="Free"
              onValueChange={(value) => {
                const free = value === "Free";
                setValue("isFree", free);
                if (free) {
                  setValue("price", 0);
                  setValue("discount", 0);
                }
              }}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="Free">Free</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Paid" id="Paid" />
                <Label htmlFor="Paid">Paid</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Paid Fields */}
          <div className={`grid grid-cols-2 gap-4 ${isFree && "opacity-50 pointer-events-none"}`}>
            <div className="space-y-1">
              <Label>Price (₹)</Label>
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className={errors.price ? "border-red-500" : ""}
              />
              {!isFree && errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Discount (%)</Label>
              <Input
                type="number"
                {...register("discount", { valueAsNumber: true })}
                className={errors.discount ? "border-red-500" : ""}
              />
              {!isFree && errors.discount && (
                <p className="text-sm text-red-500">{errors.discount.message}</p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="rounded-lg bg-muted p-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Final Price</span>
            <span className="text-xl font-semibold">₹{total}</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="submit" onClick={() => setValue("status", "draft")}>
              Save as Draft
            </Button>

            <Button type="submit" onClick={() => setValue("status", "published")}>
              Publish Course
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
