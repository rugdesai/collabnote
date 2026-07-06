import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function JoinNote() {

  const { token } = useParams();

  const navigate = useNavigate();


  useEffect(() => {

    const join = async () => {

      const authToken =
        localStorage.getItem("token");


      if (!authToken) {

        localStorage.setItem(
          "pendingInvite",
          token!
        );

        navigate("/");

        return;
      }



      try {

        const res = await api.post(
  `/collaborators/join/${token}`
);


alert("Joined successfully!");


navigate(
  `/notes/${res.data.noteId}`
);


      } catch (error) {

        console.log(error);

        alert("Invalid invite link");

      }

    };


    join();


  }, []);


  return (
    <div className="text-white">
      Joining note...
    </div>
  );
}