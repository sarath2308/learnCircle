import api from "../api";

export const creatorApi ={
    getAllCoursesForCreator:(filter:{ priceType?: string | undefined,
    category?: string | undefined,
    skillLevel?: string | undefined,
    search?: string | undefined,
    status?: string | undefined}) => 
        {
            const params = new URLSearchParams();

           if (filter.status) params.append("status", filter.status);
           if (filter.category) params.append("category", filter.category);
           if (filter.priceType) params.append("type", filter.priceType);
           if (filter.skillLevel) params.append("skillLevel", filter.skillLevel);
           if (filter.search) params.append("search", filter.search);

          const url = `/creator/course?${params.toString()}`;

           return api.get(url).then(res => res.data)
        },
    getCourseById:(id:string) => api.get(`/creator/course/${id}`).then(res => res.data),
}