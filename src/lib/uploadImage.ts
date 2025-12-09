import axios from "axios";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    import.meta.env.VITE_API_BASE_URL + "/upload",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  // expecting backend returns { url: "https://..." }
  return (res.data as { url: string }).url;

}
