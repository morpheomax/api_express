// 2. Crear un endpoint que devuelva un producto por id
// 2.5 Modificar un endpoint que devuelva un producto por id o por nombre
// 3. Crear un endpoint que cree un producto

// 4. Crear un endpoint que modifique un producto

// 5. Crear un endpoint que elimine un producto

const express = require("express");
const fs = require("fs-extra");
const app = express();
const PORT = process.env.PORT || 3000;
//middleware para leer y escribir elementos JSON por body
app.use(express.json());

// 1. Crear un endpoint que devuelva todos los productos
//LEE LOS PRODUCTOS DEL JSON
app.get("/productos", (req, res) => {
  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error en el servidor");
    } else {
      res.status(200).send(data);
    }
  });
});

// 2. Crear un endpoint que devuelva un producto por id
// BUSCA EL ID EN LA LISTA DE PRODUCTO Y DEVUELVE UN OBJETO
app.get("/productos/:id", (req, res) => {
  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error del servidor");
    } else {
      const productos = JSON.parse(data); //convierte a array
      const producto = productos.find(
        (producto) => producto.id === parseInt(req.params.id)
      );
      if (producto) {
        res.status(200).send(producto);
      } else {
        res.status(400).send("Producto no encontrado");
      }
    }
  });
});

// 3. Crear un endpoint que cree un producto
app.post("/productos", (req, res) => {
  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error en el Servidor");
    } else {
      const productos = JSON.parse(data);
      const nuevoProducto = {
        id: productos.length + 1,
        marca: req.body.marca,
        modelo: req.body.modelo,
        precio: req.body.precio,
        cantidad: req.body.cantidad,
      };
      productos.push(nuevoProducto);

      //guardar
      fs.writeFile("./db.js", JSON.stringify(productos), (err) => {
        if (err) {
          res.status(500).send("Error en el servidor");
        } else {
          res
            .status(201)
            .send(
              `Producto con id:${nuevoProducto.id} agregado satisfactoriamente`
            );
        }
      });
    }
  });
});

// 4. Crear un endpoint que modifique un producto

app.put("/productos/:id", (req, res) => {
  const { marca, modelo, precio, cantidad } = req.body;

  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error en el servidor");
    } else {
      const productos = JSON.parse(data);
      const producto = productos.find(
        (producto) => producto.id === parseInt(req.params.id)
      );
      // Validación de datos del request si existe el producto
      if (producto) {
        producto.marca = marca;
        producto.modelo = modelo;
        producto.precio = precio;
        producto.cantidad = cantidad;

        // Escribir Datos
        fs.writeFile("./db.js", JSON.stringify(productos), (err) => {
          if (err) {
            res.status(500).send("Error en el servidor");
          } else {
            res.status(200).send("Producto actualizado exitosamente");
          }
        });
      }
      // mensaje en caso de nom encontrar el producto con el id indicado
      else {
        res.status(404).send(`Producto no encontrado con id ${req.params.id}`);
      }
    }
  });
});

// 5. Crear un endpoint que elimine un producto
app.delete("/productos/:id", (req, res) => {
  // Leemos el archivo
  fs.readFile("./db.js", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error en el servidor");
    } else {
      const productos = JSON.parse(data);
      //Buscamos el ID que queremos eliminar
      const producto = productos.find(
        (producto) => producto.id === parseInt(req.params.id)
      );

      if (producto) {
        const index = productos.indexOf(producto);
        productos.splice(index, 1);

        //Sobreescribimos el archivo
        fs.writeFile("./db.js", JSON.stringify(productos), (err) => {
          if (err) {
            res.status(500).send("Error en el servidor");
          } else {
            res
              .status(200)
              .send(`Productocon el id${req.params.id} eliminado exitosamente`);
          }
        });
      } else {
        res.status(404).send("Producto no encontrado");
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
