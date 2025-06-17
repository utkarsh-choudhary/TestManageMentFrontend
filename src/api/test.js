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
    try {
        const response = await apiInstance.get("/api/get-assign-test");
        return response;
    } catch (error) {
        console.error("Error in getUserAllInfo:", error);
        return error;
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

export const submitTest = async (data) => {
    try {
        // Transform the data to match the required format
        const requestData = {
            testAssignmentId: data.assignmentId,
            candidateResponse: data.answers.map(answer => ({
                question: answer.questionId,
                answer: answer.answer
            }))
        };

        const response = await apiInstance.post("/api/submit-test", requestData);
        return response;
    } catch (error) {
        console.error("Error in submitTest:", error);
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

export const getAssignedTest = async () => {
    try {
        console.log("Calling get-assign-test API...");
        const response = await apiInstance.get("/api/get-assign-test");
        console.log("API Response:", response);
        return response;
    } catch (error) {
        console.error("Error in getAssignedTest:", error);
        return error;
    }
}


