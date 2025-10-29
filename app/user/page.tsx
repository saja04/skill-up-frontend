"use client";
import { useEffect, useState } from "react";
import NavBar from "../navbar";
import { UserInfo, User, CourseShort } from "@/types";
import getRecommendedCourses, {getRecommendedCoursesShort} from "@/utils/getRecommendedCourses";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function UserCreation() {
  const [user, setUser] = useState<User | undefined>();
  const [userInfo, setUserInfo] = useState<UserInfo | undefined>({ first_name: "", last_name: "", user_name: "", email: "", born_date: "" });
  const [userCourses, setUserCourses] = useState<Array<CourseShort>>()
  const [validUser, setValidUser] = useState<boolean>(false);
  const [invalidUser, setInvalidUser] = useState<string>("");
  const [professionInput, setProfessionInput] = useState<string>("");
  const [anotherProfession, setAnotherProfession] = useState<string>("");
  const [levelInput, setLevelInput] = useState<string>("");
  const [typeInput, setTypeInput] = useState<string>("");

  const professions = ["web dev", "data", "ml/ai", "ux/ui", "devops", "cybersecurity", "mobile dev", "product", "qa", "cloud", "blockchain", "iot"];

  const levels = ["aprendiz", "intermedio", "avanzado"];

  const types = ["bootcamp", "curso corto", "diplomado", "taller", "programa profesional"];

  function handleProfessionInput(value: string) {
    setProfessionInput(value);
  }

  function handleLevelInput(value: string) {
    setLevelInput(value);
  }

  function handleTypeInput(value: string) {
    setTypeInput(value);
  }

  function handleUserInfo(field: string, value: string) {
    if (userInfo && typeof userInfo === "object") {
      setUserInfo((prev) => {
        if (typeof prev === "object") return { ...prev, [field]: value };
      });
    }
  }
  function handleUserReset() {
    localStorage.removeItem("user");
    console.log("usuario borrado del local storage");
    window.location.reload();
  }

  function checkValidUser() {
    let userInfoCheck: boolean = false;

    for (const info in userInfo) {
      if (info === "first_name" || info === "last_name" || info === "email" || info === "user_name" || info === "born_date") {
        if (userInfo[info].length != 0) {
          userInfoCheck = true;
        }
      }
    }
    if (
      userInfo &&
      userInfoCheck &&
      (userInfo.first_name.length == 0 || userInfo.last_name.length == 0 || userInfo.email.length == 0 || userInfo.user_name.length == 0 || userInfo.born_date.length == 0)
    ) {
      setValidUser(false);
      setInvalidUser("info");
    } else if ((professionInput.length > 0 || anotherProfession.length > 0) && levelInput.length > 0 && typeInput.length > 0) {
      setValidUser(true);
      setInvalidUser("");
    } else {
      setValidUser(false);
      setInvalidUser("preferences");
    }
  }

  function createUser() {
    const user: User = {
      preferences: {
        type: typeInput,
        level: levelInput,
        area: professionInput,
      },
    };
    let userInfoCheck: boolean = false;

    for (const info in userInfo) {
      if (info === "first_name" || info === "last_name" || info === "email" || info === "user_name" || info === "born_date") {
        if (userInfo[info].length != 0) {
          userInfoCheck = true;
        }
      }
    }
    if (userInfoCheck) {
      user["info"] = userInfo;
    }

    const recommendations = getRecommendedCourses(user);

    user["recommended"] = recommendations;

    localStorage.setItem("user", JSON.stringify(user));

    redirect("/");
  }

  useEffect(() => {
    async function main() {
      const rawUser = localStorage.getItem("user") as string;
      const userr:User = JSON.parse(rawUser);

      const recommenededShortCourses = getRecommendedCoursesShort(userr?.completed_courses ? userr.completed_courses : []) ;

      setUser(userr);
      setUserCourses(recommenededShortCourses)
    }
    main();
  }, []);

  useEffect(() => {
    async function main() {
      checkValidUser();
    }
    main();
  }, [professionInput, anotherProfession, levelInput, typeInput, userInfo]);

  return (
    <div className="w-screen">
      <NavBar />
      {!user ? (
        <div>
          <div className="mt-15 flex flex-col items-center">
            <h4 className="text-4xl">Antes de usar nuestra aplicacion, cuentanos mas sobre tu perfil y que tipo de propuestas estas buscando</h4>

            <div className="mt-20 flex flex-col items-center bg-zinc-800 py-5 w-10/12 rounded-xl">
              <h5 className="text-3xl mt-3">¿A que area te dedicas o quieres dedicarte?</h5>
              <div className="w-10/12 flex flex-wrap gap-10 my-10 justify-center">
                {professions.map((profession, index) => (
                  <label
                    className="border border-white bg-black py-4 rounded-lg px-10 flex items-center space-x-4 transition-transform duration-150 ease-in-out hover:-translate-y-1 active:translate-y-1"
                    key={index}
                  >
                    <input name="profession" checked={professionInput === profession} onChange={(e) => handleProfessionInput(e.target.value)} value={profession} type="radio" className="radio-input" />
                    {profession === "iot" ? (
                      <span className="first-letter:uppercase text-lg">{profession} (Internet of things)</span>
                    ) : (
                      <span className="first-letter:uppercase text-lg">{profession}</span>
                    )}
                  </label>
                ))}
                <label className="border border-white bg-black py-4 rounded-lg px-10 flex items-center space-x-4 transition-transform duration-200 ease-in-out hover:-translate-y-1 active:translate-y-0">
                  <input name="profession" checked={professionInput === "another"} onChange={(e) => handleProfessionInput(e.target.value)} value={"another"} type="radio" className="radio-input" />
                  <span className="first-letter:uppercase">Otra</span>
                  {professionInput === "another" ? (
                    <input type="text" className="userInput w-60 py-1 px-4" placeholder="Desarrollo de videojuegos" value={anotherProfession} onChange={(e) => setAnotherProfession(e.target.value)} />
                  ) : (
                    <></>
                  )}
                </label>
                <label className="border border-white bg-black py-4 rounded-lg px-10 flex items-center space-x-4 transition-transform duration-200 ease-in-out hover:-translate-y-1 active:translate-y-0">
                  <input name="profession" checked={professionInput === "none"} onChange={(e) => handleProfessionInput(e.target.value)} value={"none"} type="radio" className="radio-input" />
                  <span className="first-letter:uppercase">No estoy segur@</span>
                </label>
              </div>
            </div>
            <div className="mt-20 flex flex-col items-center bg-zinc-800 py-5 w-10/12 rounded-xl">
              <h5 className="text-3xl mt-3">
                Dentro del area{" "}
                {!anotherProfession && professionInput != "another" ? (
                  <span className="uppercase text-green-700">{professionInput.trim()}</span>
                ) : (
                  <span className="uppercase text-green-700">{anotherProfession.trim()}</span>
                )}
                , ¿En que nivel consideras que te encuentras?
              </h5>

              <div className="w-10/12 flex flex-wrap gap-10 my-10 justify-center">
                {levels.map((level, index) => (
                  <label
                    className="border border-white bg-black py-4 rounded-lg px-10 flex items-center space-x-4 transition-transform duration-150 ease-in-out hover:-translate-y-1 active:translate-y-1"
                    key={index}
                  >
                    <input name="level" checked={levelInput === level} onChange={(e) => handleLevelInput(e.target.value)} value={level} type="radio" className="radio-input" />
                    <span className="first-letter:uppercase text-lg">{level}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-20 flex flex-col items-center bg-zinc-800 py-5 w-10/12 rounded-xl">
              <h5 className="text-3xl mt-3">¿Que tipo de educacion estas buscando?</h5>
              <div className="w-10/12 flex flex-wrap gap-10 my-10 justify-center">
                {types.map((type, index) => (
                  <label
                    className="border border-white bg-black py-4 rounded-lg px-10 flex items-center space-x-4 transition-transform duration-150 ease-in-out hover:-translate-y-1 active:translate-y-1"
                    key={index}
                  >
                    <input name="type" checked={typeInput === type} onChange={(e) => handleTypeInput(e.target.value)} value={type} type="radio" className="radio-input" />
                    <span className="first-letter:uppercase text-lg">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <h5 className=" text-4xl mt-15">Crea tu usuario (opcional)</h5>

            <div className="bg-zinc-800 w-4/5 rounded-xl py-10 px-20 my-10 flex flex-row justify-around gap-10 ">
              <div className="flex flex-col gap-10 w-1/4">
                <div className="flex flex-col gap-2">
                  <p className="indicator">Nombre</p>
                  <input type="text" placeholder="Elon" onChange={(e) => handleUserInfo("first_name", e.target.value)} className="userInput" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="indicator">Apellido</p>
                  <input type="text" placeholder="Musk" onChange={(e) => handleUserInfo("last_name", e.target.value)} className="userInput" />
                </div>
              </div>
              <div className="flex flex-col gap-10 w-1/4 justify-around">
                <div className="flex flex-col gap-2">
                  <p className="indicator">Correo Electronico</p>
                  <input type="text" placeholder="ejemplo@mail.com" onChange={(e) => handleUserInfo("email", e.target.value)} className="userInput w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="indicator">Nombre de usuario (visible)</p>
                  <input type="text" placeholder="Owlkapwn" className="userInput" onChange={(e) => handleUserInfo("user_name", e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-3 w-1/4">
                <p className="indicator">Fecha de nacimiento</p>
                <input type="text" placeholder="DD-MM-YYYY" className="userInput w-full" onChange={(e) => handleUserInfo("born_date", e.target.value)} />
              </div>
            </div>
            <div className="w-4/5 flex justify-end mb-40">
              {invalidUser === "preferences" && !validUser ? (
                <div className="flex flex-row gap-4 align-center items-center">
                  <span className="text-red-500">Completa todas tus preferencias</span>
                  <button className="cursor-default text-xl px-7 bg-zinc-800 py-2 rounded-lg border text-zinc-500 border-white">Ir al sitio</button>
                </div>
              ) : invalidUser === "info" && !validUser ? (
                <div className="flex flex-row gap-4 align-center items-center">
                  <span className="text-red-500">Completa todos tus datos personales o dejalos vacios</span>
                  <button className="cursor-default text-xl px-7 bg-zinc-800 py-2 rounded-lg border text-zinc-500 border-white">Ir al sitio</button>
                </div>
              ) : (
                <button onClick={createUser} className="text-xl px-7 bg-zinc-950 py-2 rounded-lg border border-white transition ease-in duration-100 hover:-translate-y-0.5 active:translate-y-0">
                  Ir al sitio
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          {user.preferences ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full">
                <h4 className="text-4xl ml-10 mt-20">Tus preferencias:</h4>
              </div>
              <div className="w-4/5 flex flex-col bg-zinc-800 my-30 gap-8 py-9 mt-10 rounded-lg">
                <div className="flex flex-row  px-10 gap-5 items-center py-5">
                  <p className="text-xl w-1/4">Profesion/area:</p>
                  <p className="text-lg w-2/5 userInput hover:cursor-not-allowed text-zinc-600">{user.preferences.area}</p>
                </div>
                <div className="flex flex-row  px-10 gap-5 items-center py-5">
                  <p className="text-xl w-1/4">Nivel:</p>
                  <p className="w-2/5 text-lg userInput hover:cursor-not-allowed text-zinc-600">{user.preferences.level}</p>
                </div>
                <div className="flex flex-row  px-10 gap-5 items-center py-5">
                  <p className="text-xl w-1/4">Tipo de propuesta que buscas:</p>
                  <p className="w-2/5 text-lg userInput hover:cursor-not-allowed text-zinc-600">{user.preferences.type}</p>
                </div>
                <div className="w-full flex flex-col mt-10  px-10 gap-5 py-5">
                  <p className="text-2xl w-1/4">Cursos a los que te anotaste:</p>
                  <div className="flex flex-col gap-5">
                    {userCourses ? (
                      userCourses.map((shortCourse) => (
                        <div key={shortCourse.id}>
                          <a href={`/cursos/${shortCourse.id}`} className="border-green-700 border text-lg hover:cursor-pointer userInput w-fit bg-black hover:border-white hover:text-green-700">{shortCourse.title}</a>
                        </div>
                      ))
                    ) : (
                      <p>Todavia no te anotaste a ningun curso.</p>
                    )}
                  </div>
                </div>
                <div className="w-full flex justify-end">
                  <button onClick={handleUserReset} className="mr-10 filterbutton bg-zinc-900 transition ease-in duration-100 hover:-translate-y-0.5 active:translate-y-0">
                    Volver a escoger preferencias
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
          {user.info ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full">
                <h4 className="text-4xl ml-10">Tus datos personales:</h4>
              </div>
              <div className="w-4/5 flex flex-col bg-zinc-800 my-20 mt-10 gap-8 py-9 rounded-lg">
                <div className="w-full flex flex-col px-10 gap-20 items-center justify-center align-middle py-5">
                  <div className="w-full justify-around flex flex-row">
                    <div className="flex flex-col gap-2">
                      <p className="text-xl ">Nombre:</p>
                      <p className="text-lg w-120 userInput hover:cursor-not-allowed text-zinc-600">{user.info.first_name}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xl ">Apellido:</p>
                      <p className="text-lg w-120 userInput hover:cursor-not-allowed text-zinc-600">{user.info.last_name}</p>
                    </div>
                  </div>
                  <div className="w-full justify-around flex flex-row">
                    <div className="flex flex-col gap-2">
                      <p className="text-xl ">Email:</p>
                      <p className="text-lg w-120 userInput hover:cursor-not-allowed text-zinc-600">{user.info.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xl ">Nombre de usuario:</p>
                      <p className="text-lg w-120 userInput hover:cursor-not-allowed text-zinc-600">{user.info.user_name}</p>
                    </div>
                  </div>
                  <div className="w-full flex justify-end">
                    <button onClick={handleUserReset} className="mr-10 filterbutton bg-zinc-900 transition ease-in duration-100 hover:-translate-y-0.5 active:translate-y-0">
                      Volver a escoger preferencias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}
