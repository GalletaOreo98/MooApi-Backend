DELIMITER $$
DROP PROCEDURE IF EXISTS SP_REGISTRO_USUARIO$$
CREATE PROCEDURE `SP_REGISTRO_USUARIO`( 
    IN _email 	VARCHAR(200),
    IN _password VARCHAR(200), 
    IN _name 	VARCHAR(100) CHARACTER SET utf8mb4 COLLATE UTF8MB4_UNICODE_CI
)
SP:BEGIN
    DECLARE vnCount INT;

    -- Iniciar la transaccion
    SET autocommit=0;
    START TRANSACTION;

    IF _email='' OR _email IS NULL OR _password='' OR _password IS NULL OR _name='' OR _name IS NULL THEN
        SELECT FALSE AS ok, 'Es posible que hayan campos vacios' AS message;
        LEAVE SP;
    END IF;

    -- Verificando si ya existe el nombre
    SELECT COUNT(*) INTO vnCount FROM user
        WHERE name = _name;
    IF vnCount<>0 THEN
        SELECT FALSE AS ok, 'Ese nombre ya existe' AS message;
        LEAVE SP;
    END IF;

    -- Verificando si ya existe el email
    SELECT COUNT(*) INTO vnCount FROM user
        WHERE email = _email;
    IF vnCount<>0 THEN
        SELECT FALSE AS ok, 'Ese email ya existe' AS message;
        LEAVE SP;
    END IF;

	INSERT INTO user (email, password, name) VALUES (_email, _password, _name);
      
    SELECT TRUE AS ok, 'Registro exitoso' AS message, last_insert_id() AS insertId;

    COMMIT;
END$$