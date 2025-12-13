import { useState } from "react";
import { Button } from "../ui/button";
import Modal from "../Modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ChapterSchema } from "@/schema/shared/create.course.chapter.schema";
import { AlertCircle } from "lucide-react";

interface IStep2Props
{
    handleNext:()=> void;
    handlePrev:() => void;
}
const Step2Resources = ({handleNext,handlePrev}: IStep2Props)=>
{
  const  [createChapterModal,setCreateChapterModal] = useState(false)
  const [chapterCreate,setChapterCreate]=useState({
    title:'',
    description:''
  })
  const [chapterError,setChapterErrors]=useState({
    title:'',
    description:''
  })
const createChapterValidation = () => {
  const result = ChapterSchema.safeParse(chapterCreate);

  if (!result.success) {
    const flat = result.error.flatten().fieldErrors;

    setChapterErrors({
      title: flat.title?.[0] || "",
      description: flat.description?.[0] || "",
    });

    return false;
  }

  setChapterErrors({
    title: "",
    description: "",
  });

  return true;
};

const handleNextValidate = ()=>
{
   handleNext();
}
  
return(
    <>
    <div>
        <div className="flex justify-end"> 
           <Button className="bg-blue-500" onClick={()=>setCreateChapterModal(true)}>+ Create Chapter</Button>
        </div>

        <div className="p-4">
       <Modal isOpen={createChapterModal} onClose={()=>setCreateChapterModal(false)} onSave={()=>createChapterValidation()}>
        <div>
           <Label className="m-1">title</Label>
        <Input type="text" onChange={(e)=> setChapterCreate((prev)=>({...prev,title:e.target.value}))} placeholder="Enter a title..."></Input>
         {chapterError.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {chapterError.title}
              </p>
         )}
      <Label className="m-1">description</Label>
        <Textarea rows={6} onChange={(e)=> setChapterCreate((prev)=>({...prev,description:e.target.value}))} placeholder="Enter description.." />
          {chapterError.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {chapterError.description}
              </p>
         )}
        </div>
       </Modal>
        </div>
         <div className="mt-8 flex justify-between">
  <Button  className="bg-blue-500" onClick={handlePrev}>Prev</Button>
   <Button className="bg-green-500" onClick={handleNext}>Next</Button>
      </div>
    </div>
    </>
)
}

export default Step2Resources;