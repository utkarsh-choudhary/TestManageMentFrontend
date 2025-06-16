import apiInstance from "../axiosInstance/axiosInstance";


export const createTest=async(data)=>{
    try{

        const response=await apiInstance.post("/api/tests",data);

        return response;

    }catch(error){

        console.log(error);
        return error;
    }
}

export const getTest=async(id)=>{

    try{

        const response=await apiInstance.get(`/api/test/${id}`);

        return response;


    }catch(error){
        console.log(error);
        return error;
    }

}

export const getUserAllInfo=async()=>{
      try{

        const response=await apiInstance.get("api/get-user-tests");
        return response;

      }catch(error){

        console.log("ERROR");
        console.log(error);
      }
}


export const getAllTests=async()=>{
    try{

        const response=await apiInstance.get("/api/get-all-test");

        return response;

    }catch(error){

        console.log(error);
        return error;
    }
}


export const getUserProfile= async()=>{
    try {
        const response=await apiInstance.get("/api/users/get-user-details")
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const submitTest=async(data)=>{
    try{

        const response=await apiInstance.post("/api/submit-test",data);

        return response;

    }catch(error){

        console.log(error);
        return error;
    }
}

 
export const getTests=async(id)=>{
    try{

        const response=await apiInstance.get(`/api/get-test-results/${id}`);

        return response;

    }catch(error){

        console.log(error);
        return error;
    }
}   

export const assignTest=async(id)=>{
    try{

        const response=await apiInstance.get(`/api/get-test-analytics/${id}`);

        return response;

    }catch(error){

        console.log(error);
        return error;
    }
}
  


export const getAllTestsAssigned=async()=>{
    try{    

        const response=await apiInstance.get("/api/get-all-assign-test");

        return response;    

    }catch(error){
        console.log(error);
        return error;
    }
}


export const assignTests=async(data)=>{
    try{    

        const response=await apiInstance.post("/api/assign-test",data);     

        return response;

    }catch(error){
        console.log(error);
        return error;
    }


}


