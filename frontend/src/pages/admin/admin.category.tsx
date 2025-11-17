import { PaginatedTable } from "@/components/PaginatedTable";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Input } from "@/components/ui/input";

const CategoryManagement = () => {
  return (
    <div>
      <div className="flex p-4 ">
        <Input className="w-6xl mr-14 dark:bg-white" />

        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-green-600 text-white dark:text-white flex items-center space-x-2"
        >
          <span>+ CREATE</span>
        </HoverBorderGradient>
      </div>
      <PaginatedTable headers={["name", "age"]} data={[{ name: "sarath", age: 12 }]} />
    </div>
  );
};

export default CategoryManagement;
