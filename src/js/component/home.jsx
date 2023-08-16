import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const [inputValue, setInputValue] = useState({label:"", done: false});
  const [todos, setTodos] = useState([]);

  const url = "https://playground.4geeks.com/apis/fake/todos/user/jorge";

  async function cargarTarea() {
    try {
      let response = await fetch(url);
      // if (!response.ok) {
      //   console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
      //   return;
      // }
      if (response.ok){
        let data = await response.json();
      setTodos(data);
      }
      if (response.status==404){
        createUser();
      }
      
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  async function agregarTarea() {
    try {
      if (inputValue.label.trim() === "") {
        alert("La tarea no puede estar vacía");
        return;
      }
      let response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...todos, inputValue])
      });

      if (!response.ok) {
        console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
        return;
      }else{
        cargarTarea()
        setInputValue({label:"", done: false});// Limpiar el input después de agregar una tarea
      }

    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  async function eliminarTarea() {
    try {
      let response = await fetch(url, {
        method: "DELETE"
      });
      if (!response.ok) {
        console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
        return;
      } else {
        cargarTarea(); // Recargar tareas después de eliminar una
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  async function actualizarTarea(index, updatedTask) {
    try {
      let response = await fetch(`${url}/${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
      });
      if (!response.ok) {
        console.error(`Error en la petición: ${response.status} - ${response.statusText}`);
        return;
      }
      await cargarTarea(); // Recargar tareas después de actualizar una
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  }

  

  const handleKeyPress = async (e) => {
    // e.preventDefault();
    if (e.key === "Enter" && inputValue.label.trim() !== "") {
      await agregarTarea();
      
    }
  };

  const tasksRemaining = todos.length;

  async function createUser(){
    try {
      let response = await fetch(url, {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify([])
      }) 
      if (response.ok){
        cargarTarea();
      }    
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    cargarTarea();
  }, []);

  return (
    <div className="container">
      <h1>Rutina {inputValue.label}</h1>
      <ul>
        <li>
          <form onSubmit={(e) =>{e.preventDefault()} }>
            <input
              type="text"
              onChange={(e) => setInputValue({...inputValue, label: e.target.value})}
              value={inputValue.label}
              onKeyPress={handleKeyPress}
              placeholder="Agregar tareas"
            />
          </form>
        </li>
        {todos.map((task, index) => (
          <li key={index}>
            {task.label}{" "}
            <FontAwesomeIcon
              icon={faTimes}
              style={{ color: "#c800ff", cursor: "pointer" }}
              onClick={() => eliminarTarea()}
            />
            <FontAwesomeIcon
              icon={faEdit}
              style={{ color: "#007bff", cursor: "pointer", marginLeft: "10px" }}
              onClick={() => actualizarTarea(index, { ...task, label: "Nueva etiqueta" })}
            />
          </li>
        ))}
      </ul>
      <div>Quedan {tasksRemaining} más por hacer</div>
    </div>
  );
};

export default Home;
