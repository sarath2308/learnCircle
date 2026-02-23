"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pricingSchema, type PricingFormData } from "@/schema/course.price.schema";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useCourseUpdatePrice } from "@/hooks/shared/course/course.update.price";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CoursePricingForm() {
  const courseId = useSelector((state: RootState) => state.courseDetails.id);
  const updatePriceMutation = useCourseUpdatePrice();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PricingFormData>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      isFree: true,
      price: 0,
      discount: 0,
      status: "draft",
    },
  });

  const isFree = watch("isFree");
  const price = watch("price") || 0;
  const discount = watch("discount") || 0;

  // Calculation Logic
  const discountAmount = isFree ? 0 : (price * discount) / 100;
  const finalPrice = isFree ? 0 : Math.max(price - discountAmount, 0);

  const onFormSubmit = async (data: PricingFormData, status: "draft" | "published") => {
    try {
      await updatePriceMutation.mutateAsync({
        courseId: courseId ?? "",
        payload: {
          type: data.isFree ? "Free" : "Paid",
          price: data.price,
          discount: data.discount,
          status: status, // Pass status directly
        },
      });
      toast.success(`Course ${status === "published" ? "published" : "saved as draft"}!`);
      navigate(-1);
    } catch (error) {
      toast.error("Failed to update pricing.");
    }
  };

  return (
    <Card className="max-w-2xl border-none shadow-xl dark:bg-slate-950">
      <CardHeader className="border-b dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black tracking-tight">Pricing Strategy</CardTitle>
          <Badge variant={isFree ? "secondary" : "default"} className="rounded-md uppercase">
            {isFree ? "Open Source" : "Premium Content"}
          </Badge>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit((data) => onFormSubmit(data, watch("status")))}>
        <CardContent className="space-y-8 pt-8">
          {/* Toggle Type */}
          <div className="space-y-4">
            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Access Type
            </Label>
            <RadioGroup
              value={isFree ? "free" : "paid"}
              onValueChange={(val) => {
                const free = val === "free";
                setValue("isFree", free);
                if (free) {
                  setValue("price", 0);
                  setValue("discount", 0);
                }
              }}
              className="grid grid-cols-2 gap-4"
            >
              <Label
                htmlFor="r-free"
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isFree
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="free" id="r-free" />
                  <span className="font-bold">Free Course</span>
                </div>
              </Label>

              <Label
                htmlFor="r-paid"
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  !isFree
                    ? "border-blue-600 bg-blue-50/10"
                    : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="paid" id="r-paid" />
                  <span className="font-bold">Paid Course</span>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <Separator className="dark:bg-slate-800" />

          {/* Pricing Grid */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all ${isFree ? "grayscale opacity-30 pointer-events-none" : ""}`}
          >
            <div className="space-y-2">
              <Label className="font-bold">Base Price (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <Input
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                  disabled={isFree}
                  className="pl-8 h-12 rounded-xl border-2 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              {errors.price && (
                <p className="text-xs font-bold text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Incentive Discount (%)</Label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  %
                </span>
                <Input
                  type="number"
                  {...register("discount", { valueAsNumber: true })}
                  disabled={isFree}
                  className="pr-8 h-12 rounded-xl border-2 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              {errors.discount && (
                <p className="text-xs font-bold text-red-500 mt-1">{errors.discount.message}</p>
              )}
            </div>
          </div>

          {/* Visual Price Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-slate-500 font-medium">
                <span>Platform Listing Price</span>
                <span>₹{price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-emerald-600 font-medium">
                <span>Applied Discount</span>
                <span>- ₹{discountAmount.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-tighter text-slate-400">
                    Student Pays
                  </p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">
                    ₹{finalPrice.toLocaleString()}
                  </p>
                </div>
                {!isFree && discount > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none px-3 py-1">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl font-bold gap-2"
              disabled={isSubmitting}
              onClick={() => setValue("status", "draft")}
            >
              <Save size={18} /> Save Draft
            </Button>
            <Button
              className="flex-[2] h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-500/20"
              disabled={isSubmitting}
              onClick={() => setValue("status", "published")}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              Confirm & Publish
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
