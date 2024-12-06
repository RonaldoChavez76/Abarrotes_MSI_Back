"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
class UsuariosController {
    createUs(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                console.log(req.body); // Para depuración, muestra los datos del cuerpo de la solicitud
                yield connection.query('INSERT INTO usuarios SET ?', [req.body]); // Insertar los datos en la tabla "usuarios"
                resp.json({ message: 'User Saved' }); // Respuesta exitosa
            } catch (error) {
                resp.status(500).json({ message: 'Error saving user', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                // Realizar la actualización de los datos del usuario
                yield connection.query('UPDATE usuarios SET ? WHERE id = ?', [req.body, id]);
                resp.json({ message: 'The user was updated' }); // Respuesta exitosa
            } catch (error) {
                resp.status(500).json({ message: 'Error updating user', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                // Ejecutar la consulta de eliminación
                const [result] = yield connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
                if (result.affectedRows > 0) {
                    resp.json({ message: 'The user was deleted' }); // Respuesta exitosa si se eliminó un usuario
                } else {
                    resp.status(404).json({ message: 'User not found' }); // Si no se encuentra el usuario
                }
            } catch (error) {
                resp.status(500).json({ message: 'Error deleting user', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    /* login(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const result = yield database_1.default.query('SELECT u.id, u.nombre, u.email, tu.id AS tipo_usuario FROM usuarios u JOIN tipo_usuario tu ON u.id_tipo_usuario = tu.id WHERE u.email = ? AND u.password = ?', [email, password]);
            if (result.length > 0) {
                resp.json(result[0]);
            }
            else {
                resp.status(401).json({ message: 'Invalid email or password' });
            }
        });
    } */
    login(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
    
            try {
                // Realizamos la consulta con mysql2/promise
                const [result] = yield database_1.default.query(
                    'SELECT u.id, u.nombre, u.email, tu.id AS tipo_usuario FROM usuarios u JOIN tipo_usuario tu ON u.id_tipo_usuario = tu.id WHERE u.email = ? AND u.password = ?',
                    [email, password]
                );
    
                // Verificamos si hay resultados
                if (result.length > 0) {
                    resp.json(result[0]); // Devolvemos el primer resultado
                } else {
                    resp.status(401).json({ message: 'Invalid email or password' });
                }
            } catch (error) {
                console.error('Error en la consulta login:', error);
                resp.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const connection = yield database_1.default.getConnection(); // Obtener la conexión
            try {
                const [usuarios] = yield connection.query('SELECT * FROM usuarios WHERE id = ?', [id]); // Ejecutar la consulta
                if (usuarios.length > 0) {
                    return resp.json(usuarios[0]); // Devolver el primer usuario encontrado
                }
                resp.status(404).json({ text: 'The user doesn\'t exist' }); // Si no se encuentra el usuario
            } catch (error) {
                resp.status(500).json({ message: 'Error retrieving the user', error: error.message }); // Manejo de errores
            } finally {
                connection.release(); // Liberar la conexión
            }
        });
    }
    
    // Listar todos los usuarios
    list(req, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield database_1.default.getConnection(); // Obtener la conexión
        try {
            const [usuarios] = yield connection.query('SELECT * FROM usuarios'); // Ejecutar la consulta
            resp.json(usuarios); // Enviar los resultados como respuesta
        } catch (error) {
            resp.status(500).json({ message: 'Error retrieving users', error: error.message }); // Manejo de errores
        } finally {
            connection.release(); // Liberar la conexión
        }
    });
    }

    // Obtener usuarios por tipo de usuario
    getByTipoUsuario(req, resp) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const connection = yield database_1.default.getConnection(); // Obtener la conexión
        try {
            const [usuarios] = yield connection.query('SELECT * FROM usuarios WHERE id_tipo_usuario = ?', [id]); // Ejecutar la consulta
            if (usuarios.length > 0) {
                resp.json(usuarios); // Enviar los resultados si se encuentran usuarios
            } else {
                resp.status(404).json({ message: 'No users found for this type' }); // Si no se encuentran usuarios
            }
        } catch (error) {
            resp.status(500).json({ message: 'Error retrieving users by type', error: error.message }); // Manejo de errores
        } finally {
            connection.release(); // Liberar la conexión
        }
    });
    }

}
const usuariosController = new UsuariosController();
exports.default = usuariosController;
