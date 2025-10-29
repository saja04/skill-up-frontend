"use client";
import { Course, Review, User } from "@/types";
import { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { getStarsCount } from "@/utils/setStars";
import toast, { Toaster } from "react-hot-toast";
import { sleep } from "@/utils/sleep";

export default function Propuesta({ id }: { id: string }) {
  const [propuesta, setPropuesta] = useState<Course>();
  const [addReviewComponent, setAddReviewComponent] = useState<boolean>();
  const [stars, setStars] = useState<number>(0);
  const [review, setReview] = useState<string>();
  const [incompleteComponent, setIncompleteComponent] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();

  function handleStars(rating: number) {
    setStars(rating);
  }

  function handleStarsReset() {
    setStars(0);
  }

  function handleReviewText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setReview(e.target.value);
  }

function handleCourseCompleted() {
  if (!propuesta) return;

  if (user?.info) {
    const currentId = Number(id);
    const nextCompleted = Array.from(
      new Set([...(user.completed_courses ?? []), currentId])
    );

    const nextUser: User = {
      ...user,
      completed_courses: nextCompleted,
    };

    localStorage.setItem("user", JSON.stringify(nextUser));
    setUser(nextUser);

    toast.success("Curso marcado como completado. Ahora puedes dejar una reseña del mismo.");
  } else {
    toast.error("No tienes informacion de usuario. Por favor agrega tu usuario y vuelve a intentarlo");
  }
}


  function addReview() {
    if (stars && review) {
      const propuestas: Array<Course> = JSON.parse(localStorage.getItem("db") as string);
      const reviewobj: Review = {
        username: user?.info?.user_name ? user?.info?.user_name : '',
        stars: stars,
        review: review ? review : "",
      };
      propuestas[parseInt(id)].reviews.push(reviewobj);
      const starsValue: number = getStarsCount(propuestas[parseInt(id)].reviews);
      propuestas[parseInt(id)].stars = starsValue;
      localStorage.setItem("db", JSON.stringify(propuestas));
      window.location.reload();
    } else {
      setIncompleteComponent(true);
    }
  }

  useEffect(() => {
    async function main() {
      if (stars > 0 && review && review.length > 15) {
        setIncompleteComponent(false);
      }
    }
    main();
  }, [stars, review]);

  useEffect(() => {}, [user]);

  useEffect(() => {
    async function main() {
      const raw: string | null = localStorage.getItem("db") as string;
      const parsed = await JSON.parse(raw);
      setPropuesta(parsed[id]);

      const rawUser: string | null = localStorage.getItem("user") as string;
      const parsedUser = await JSON.parse(rawUser);
      console.log(parsedUser);

      setUser(parsedUser);
    }
    main();
  }, []);

  const tooltipArray = ["0.5 Estrellas", "1 Estrellas", "1.5 Estrellas", "2 Estrellas", "2.5 Estrellas", "3 Estrellas", "3.5 Estrellas", "4 Estrellas", "4.5 Estrellas", "5 Estrellas"];
  const fillColorArray = ["#f17a45", "#f17a45", "#f19745", "#f19745", "#f1a545", "#f1a545", "#f1b345", "#f1b345", "#f1d045", "#f1d045"];

  return (
    <div className="w-full">
      {propuesta ? (
        <div>
          <h3 className="ml-5 text-4xl mt-20">{propuesta.title}</h3>
          <div className="w-screen flex-col justify-center items-center align-middle h-content my-10">
            <div className="flex flex-row w-full ">
              <div className="w-3/5 bg-black rounded h-100 mx-3 p-5 flex flex-col gap-2">
                <div>
                  <h5 className="text-2xl">Descripcion: </h5>
                  <p className="text-md">{propuesta.description}</p>
                </div>
                <div>
                  <h5 className="text-2xl">Perfil una vez completado el curso</h5>
                </div>
              </div>
              <div className="flex flex-col w-2/5 mx-3 mr-5 items-center">
                {user?.completed_courses && user?.completed_courses.includes(Number(id)) ? (
                  <></>
                ) : (
                  <div className="w-full flex justify-end">
                    <button onClick={handleCourseCompleted} className="filterbutton mr-10 -mt-20 h-10">
                      Marcar como en curso o completado
                    </button>
                  </div>
                )}

                {addReviewComponent ? (
                  <div className="w-4/5 mb-6">
                    <div className="bg-zinc-800 flex flex-col py-6 rounded-lg px-10 w-full gap-5 border-2 border-zinc-400">
                      <div className="w-full flex justify-end">
                        <button onClick={() => setAddReviewComponent(false)} className="text-sm w-5 flex items-center justify-center bg-white text-black rounded-full">
                          X
                        </button>
                      </div>
                      <h4>Que te parecio este curso/carrera?</h4>
                      <div className="flex flex-row">
                        <Rating
                          onClick={handleStars}
                          size={50}
                          transition
                          allowFraction
                          showTooltip
                          initialValue={stars}
                          tooltipArray={tooltipArray}
                          fillColorArray={fillColorArray}
                          tooltipDefaultText="Ingresa una calificacion"
                        />
                        {stars ? (
                          <button onClick={handleStarsReset} className="px-2 w-5 text-2xl">
                            ↻
                          </button>
                        ) : (
                          <div className="w-5"></div>
                        )}
                      </div>
                      <textarea
                        value={review}
                        onChange={handleReviewText}
                        name="review"
                        placeholder="Comentale al resto de estudiantes tu experiencia..."
                        className="h-40 bg-zinc-900 px-4 py-2 rounded"
                      ></textarea>
                      {incompleteComponent ? (
                        <div className="flex justify-end flex-col gap-3">
                          <span className="text-red-600">Asegurate de completar el rating y que tu reseña tenga mas de 15 caracteres</span>
                          <div className="flex justify-end">
                            <button onClick={addReview} className="cursor-default w-auto px-4 py-1 text-zinc-500 text-sm bg-zinc-700 rounded border-zinc-400 border">
                              Enviar reseña
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button onClick={addReview} className="px-4 py-1 text-sm bg-zinc-900 rounded border-white border">
                            Enviar reseña
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : user?.completed_courses && user?.completed_courses.includes(Number(id)) ? (
                  <div className="w-full flex justify-end">
                    <button onClick={() => setAddReviewComponent(true)} className="filterbutton mr-10 -mt-20 h-10">
                      Agregar reseña
                    </button>
                  </div>
                ) : (
                  <></>
                )}

                <div className="w-full bg-zinc-900 rounded-lg px-4 py-5 mx-3">
                  <div>
                    <h5 className="text-xl">Reseñas</h5>
                    {propuesta.reviews.length > 0 ? (
                      <div className="mt-4 flex flex-col gap-4 max-h-80 overflow-scroll">
                        {propuesta.reviews.map((review, index) => (
                          <div key={index} className=" bg-zinc-800 rounded-xl py-4 px-10">
                            <div className="flex flex-row justify-between mb-2">
                              <p>{review?.username}</p>
                              <p>★ {review?.stars}/5</p>
                            </div>
                            <p className="italic">
                              {'"'}
                              {review?.review}
                              {'"'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4">Todavia no hay reseñas sobre este {propuesta.type}, se el primer usuario en escribir una!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Toaster
        toastOptions={{
          style: {
            width: "fit-content",
            paddingInline: "2vw",
            maxWidth: "80%",
          },
        }}
      />
    </div>
  );
}
