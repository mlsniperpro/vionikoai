import { useState } from "react";
import { useEffect } from "react";
import ChatBody from "@/components/ChatBody";
import ChatInput from "@/components/ChatInput";
import { auth, db } from "../config/firebase";
import { useMutation } from "react-query";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import { ReactMarkdown } from "react-markdown";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
//If API_KEY is none then load the API_KEY from the database
import HomeIcon from '@mui/icons-material/Home';
import LanguageIcon from '@mui/icons-material/Language';
import usePremiumStatus from "@/stripe/usePremiumStatus";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
function Tutor() {

  const [user, userLoading] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(true);
  const [language, setLanguage] = useState("spanish");
  const [chat, setChat] = useState([]);
  const [limit, setLimit] = useState(20000);
  const userIsPremium = usePremiumStatus(user);
 const retrieveWordLimit = async () => {
   try {
     const limitDoc = await getDocs(collection(db, "wordlimit"));
     const limit = limitDoc.docs[0].data().limit;
     setLimit(limit);
   } catch (error) {
     console.log("Error retrieving prices: ", error);
   }
 };

 React.useEffect(() => {
   retrieveWordLimit();
 }, [loading]);
 useEffect(() => {
   const checkSubscription = async () => {
     try {
       if (!user && !userLoading) {
         Router.push("/login");
         return;
       }

       const subscribersSnapshot = await getDocs(collection(db, "subscribers"));
       const subscribers = subscribersSnapshot.docs.map((doc) => doc.data());
       const userSubscriptions = subscribers.filter(
         (subscriber) => subscriber.userId === auth.currentUser.uid
       );
       const latestSubscription = userSubscriptions.reduce(
         (a, b) => (a.subscriptionEndDate > b.subscriptionEndDate ? a : b),
         {}
       );

       const wordsSnapshot = await getDocs(
         query(
           collection(db, "wordsgenerated"),
           where("userId", "==", auth.currentUser.uid)
         )
       );
       const wordsGenerated = wordsSnapshot.docs.map((doc) => doc.data());
       const currentUserWords = wordsGenerated[0] || { count: 0 };

       if (
         Date.now() < latestSubscription.subscriptionEndDate ||
         currentUserWords.count < limit ||
         auth.currentUser.uid === "M8LwxAfm26SimGbDs4LDwf1HuCb2" ||
         auth.currentUser.uid === "fcJAePkUVwV7fBR3uiGh5iyt2Tf1"
       ) {
         setSubscribed(true);
       } else if(userIsPremium){
          setSubscribed(true);
        }
        else {
         setSubscribed(false);
       }
     } catch (error) {
       console.log(error);
     } finally {
       setLoading(false);
       
     }
   };
   checkSubscription();
 }, [limit, user]);
 useEffect(() => {
  if(!subscribed && !loading && !userIsPremium && !userLoading && user){
         Router.push("/");
       }
  }, [loading]);

  useEffect(() => {
    if (language === "en") {
      setChat([
        {
          role: "system",
          content:
            "Act as an experienced worldwide advertising copywriter with more than 20 years experience, you will interact step-by-step, asking one question at a time and waiting for a response as if you were interviewing a client about their needs to offer the best proposal at the end of the advertising copywriting. You will present the available options to respond in a numbered list format to make it easier to answer. The first question is about what type of copywriting is desired from these options (landing page, sales letter, email marketing, blog writing, video script, YouTube video script, Facebook ad, Google ad, cold direct message, cold email, Instagram story idea, YouTube video idea, Twitter text, lead magnet, marketing campaign). The second question will be about the tone of the copywriting, and you will suggest these types of tones (friendly, relaxed, professional, fun, bold, adventurous, witty, persuasive, empathetic). The third question will be about the ideal avatar of the target customer. The fourth question will be about the product or service offered and what makes it special. The fifth question will be about the desired outcome. With all the answers you obtain, you will share the specific texts that will be used with the best advertising copywriting suggested for each of the components of the requested type of writing. It is important not to give general recommendations, share exactly what structure and text to use, and also share recommendations regarding design and format at the end. Let's start with only the first question without saying who you are",
        },
        {
          role: "user",
          content: "START",
        },
        {
          role: "assistant",
          content:
            "What type of copywriting do you need?\n\n1. Landing page\n2. Sales letter\n3. Email marketing\n4. Blog writing\n5. Video script\n6. YouTube video script\n7. Facebook ad\n8. Google ad\n9. Cold direct message\n10. Cold email\n11. Instagram story idea\n12. YouTube video idea\n13. Twitter text\n14. Marketing campaign",
        },
      ]);
    } else {
      setChat([
        {
          role: "system",
          content:
            "Actúe como un experimentado redactor publicitario con más de 20 años de experiencia a nivel mundial, interactuará paso a paso, haciendo una pregunta a la vez y esperando una respuesta como si estuviera entrevistando a un cliente sobre sus necesidades para ofrecer la mejor propuesta al final de la redacción publicitaria. Presentará las opciones disponibles para responder en un formato de lista numerada para facilitar la respuesta. La primera pregunta es sobre qué tipo de redacción se desea de estas opciones (página de aterrizaje, carta de ventas, marketing por correo electrónico, escritura de blog, guión de video, guión de video de YouTube, anuncio de Facebook, anuncio de Google, mensaje directo frío, correo electrónico frío, idea de historia de Instagram, idea de video de YouTube, texto de Twitter, imán de prospectos, campaña de marketing). La segunda pregunta será sobre el tono de la redacción, y sugerirá estos tipos de tonos (amistoso, relajado, profesional, divertido, audaz, aventurero, ingenioso, persuasivo, empático). La tercera pregunta será sobre el avatar ideal del cliente objetivo. La cuarta pregunta será sobre el producto o servicio ofrecido y qué lo hace especial. La quinta pregunta será sobre el resultado deseado. Con todas las respuestas que obtenga, compartirá los textos específicos que se utilizarán con la mejor redacción publicitaria sugerida para cada uno de los componentes del tipo de escritura solicitado. Es importante no dar recomendaciones generales, compartir exactamente qué estructura y texto usar, y también compartir recomendaciones sobre diseño y formato al final. Comencemos solo con la primera pregunta sin decir quién es usted.",
        },
        {
          role: "user",
          content: "EMPEZAR",
        },
        {
          role: "assistant",
          content:
            "¿Qué tipo de redacción publicitaria necesita?\n\n1. Página de aterrizaje\n2. Carta de ventas\n3. Marketing por correo electrónico\n4. Redacción de blog\n5. Guión de video\n6. Guión de video de YouTube\n7. Anuncio de Facebook\n8. Anuncio de Google\n9. Mensaje directo frío\n10. Correo electrónico frío\n11. Idea de historia de Instagram\n12. Idea de video de YouTube\n13. Texto de Twitter\n14. Campaña de marketing",
        },
      ]);
    }
  }, [language]);

  const fetchResponse = async (chat) => {
    try {
      //If the chat is more than 3 values, remove the first one
      let lastFive = chat.slice(Math.max(chat.length - 40, 0));
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: lastFive,
          }),
        }
      );
      const data = await response.json();

      const updateUserWordCount = async () => {
        try {
          //Get the document from wordsgenerated collection where userId attribute is equal to the current user's uid and update it by adding 30 to curent count attribute in the same document
          const docRef = await getDocs(collection(db, "wordsgenerated"));
          const wordsGenerated = docRef.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          //Check if the any document in wordsgenerated collection has userId attribute equal to the current user's uid if so update the count attribute by adding 30 to it or else create a new document with userId attribute equal to the current user's uid and count attribute equal to 30
          if (
            wordsGenerated.some((word) => word.userId === auth.currentUser.uid)
          ) {
            const docRef = await getDocs(collection(db, "wordsgenerated"));
            const wordsGenerated = docRef.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const userDoc = wordsGenerated.find(
              (word) => word.userId === auth.currentUser.uid
            );
            await updateDoc(doc(db, "wordsgenerated", userDoc.id), {
              count: userDoc.count + data.choices[0].message.content.length,
            });
          } else {
            await setDoc(doc(db, "wordsgenerated", auth.currentUser.uid), {
              userId: auth.currentUser.uid,
              count: data.choices[0].message.content.length,
            });
          }
        } catch (error) {
          console.log(error);
        }
      };
      updateUserWordCount();

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  function changeLanguage() {
    if (language === "en") {
      setLanguage("spanish");
    } else if (language === "spanish") {
      setLanguage("en");
    } else {
      setLanguage("spanish");
    }
  }

  const mutation = useMutation({
    mutationFn: () => {
      return fetchResponse(chat);
    },
    onSuccess: (data) =>
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: data.choices[0].message.content },
      ]),
  });

  const sendMessage = async (message) => {
    await Promise.resolve(setChat((prev) => [...prev, message]));
    mutation.mutate();
  };

  return (
    <div className="bg-[#1A232E] h-screen py-6 relative sm:px-16 px-12 text-white overflow-hidden flex flex-col justify-between  align-middle w-screen" style={{background: "rgb(40, 48, 129)",}}>
      {/* gradients */}
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute"></div>

      {/* header */}
      <div className="uppercase font-bold  text-2xl text-center mb-3">
        <h1 style={{fontFamily:"Monospace",fontSize:'30px'}}>
          {language === "en"
            ? "VIONIKO AI Copywriting Tutor"
            : "Tutor vioniko de redacción publicitaria de IA"}
        </h1>
        {/* <p>DEMO del TUTOR VK </p> */}
      </div>
      <div><br></br><br></br>
      <Link href="/">
        <button className="block uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded" style={{background:'white',color:'rgb(40, 48, 129)',width:'200px',fontFamily:"Monospace",fontSize:'18px'}}>
         <HomeIcon /> {language === "en" ? "Home" : "Inicio"}
        </button>
      </Link>
      <button
        onClick={changeLanguage}
        className="block mt-6 uppercase mx-auto shadow bg-indigo-800 hover:bg-indigo-700 focus:shadow-outline focus:outline-none text-white text-xs py-3 px-10 rounded"
        style={{background:'white',color:'rgb(40, 48, 129)',width:'300px',fontFamily:"Monospace",fontSize:'18px',marginBottom:'10px'}}
      >
        <LanguageIcon style={{marginRight:"10px"}}/>
        {language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
      </button>
      </div>

      {/* body */}
      <div
        className="h-[90%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 px-4 self-center
      scrollbar-thumb-slate-400 scrollbar-thin scrollbar-track-gray-tranparent scrollbar-thumb-rounded-md
      "style={{border:'1px solid #fff'}}
      >
        <ChatBody chat={chat.slice(1)} />
      </div>

      {/* input */}
      <div className="w-full max-w-4xl min-w-[20rem] self-center" style={{border:'1px solid #fff'}}>
        <ChatInput sendMessage={sendMessage} loading={mutation.isLoading} style={{border:'1px solid white',fontFamily:"Monospace",fontSize:'20px'}}/>
      </div>
    </div>
  );
}

export default Tutor;
