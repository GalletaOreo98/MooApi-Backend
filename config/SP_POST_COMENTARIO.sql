DELIMITER $$
DROP PROCEDURE IF EXISTS SP_POST_COMENTARIO$$
CREATE PROCEDURE `SP_POST_COMENTARIO`( 
    IN _userId 	INT,
    IN _comentario VARCHAR(5000) CHARACTER SET utf8mb4 COLLATE UTF8MB4_UNICODE_CI
)
SP:BEGIN
    DECLARE vnCount INT;
    DECLARE vcUsername VARCHAR(200);

    -- Iniciar la transaccion
    SET autocommit=0;
    START TRANSACTION;

    IF _userId='' OR _userId IS NULL OR _comentario='' OR _comentario IS NULL THEN
        SELECT FALSE AS ok, 'Es posible que hayan campos vacios' AS message;
        LEAVE SP;
    END IF;

    -- Verificando si es usuario valido
    SELECT COUNT(*) INTO vnCount FROM user
        WHERE idUser = _userId;
    IF vnCount=0 THEN
        SELECT FALSE AS ok, 'Usuario no autorizado' AS message;
        LEAVE SP;
    END IF;

	SET vcUsername = (SELECT name FROM user WHERE idUser = _userId);

    INSERT INTO chat_global (user, comentario) VALUES (vcUsername, _comentario);
      
    SELECT TRUE AS ok, 'Post hecho' AS message;

    COMMIT;
END$$