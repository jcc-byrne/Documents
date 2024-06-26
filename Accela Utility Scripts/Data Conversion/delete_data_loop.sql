DECLARE @BATCHSIZE INT, @WAITFORVAL VARCHAR(8), @ITERATION INT, @TOTALROWS INT, @MAXRUNTIME VARCHAR(8), @BSTOPATMAXTIME BIT, @MSG VARCHAR(500)
SET DEADLOCK_PRIORITY LOW;
SET @BATCHSIZE = 10000
SET @WAITFORVAL = '00:00:05'
SET @MAXRUNTIME = '18:00:00' -- 8AM
SET @BSTOPATMAXTIME = 1 -- ENFORCE 8AM STOP TIME
SET @ITERATION = 0 -- LEAVE THIS
SET @TOTALROWS = 0 -- LEAVE THIS

set @TABLE2REMOVE = 'BAPPSPECTABLE'

WHILE @BATCHSIZE>0
BEGIN
    -- IF @BSTOPATMAXTIME = 1, THEN WE'LL STOP THE WHOLE JOB AT A SET TIME...
    IF CONVERT(VARCHAR(8),GETDATE(),108) >= @MAXRUNTIME AND @BSTOPATMAXTIME=1
    BEGIN
        RETURN
    END

    DELETE TOP(@BATCHSIZE)
    FROM @TABLE2REMOVE
    WHERE 1=1

    SET @BATCHSIZE=@@ROWCOUNT
    SET @ITERATION=@ITERATION+1
    SET @TOTALROWS=@TOTALROWS+@BATCHSIZE
    SET @MSG = 'Iteration: ' + CAST(@ITERATION AS VARCHAR) + ' Total deletes:' + CAST(@TOTALROWS AS VARCHAR)
    RAISERROR (@MSG, 0, 1) WITH NOWAIT
    WAITFOR DELAY @WAITFORVAL 
END



truncate table BAPPSPECTABLE