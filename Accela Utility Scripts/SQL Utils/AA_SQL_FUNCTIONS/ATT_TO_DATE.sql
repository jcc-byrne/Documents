USE [EMCITY_SUPP]
GO
/****** Object:  UserDefinedFunction [dbo].[ATT_TO_DATE]    Script Date: 1/26/2023 2:43:22 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER
 FUNCTION [dbo].[ATT_TO_DATE] (@P_L1_ATTRIBUTE_VALUE VARCHAR(30))
RETURNS DATETIME
AS
/*
   Revision History :   04/07/2020  Kin Lui  Remove validate on MM/DD/YYYY format, allow 2/3/2020 format as well.
*/
BEGIN
   DECLARE @V_L1_ATTRIBUTE_VALUE_DATE DATETIME
   SELECT @V_L1_ATTRIBUTE_VALUE_DATE = convert(DATETIME, @P_L1_ATTRIBUTE_VALUE, 101)
   WHERE ISDATE(@P_L1_ATTRIBUTE_VALUE) = 1
   -- AND @P_L1_ATTRIBUTE_VALUE LIKE '[01][0-9]_[0-3][0-9]_[1-9][0-9][0-9][0-9]'
   RETURN @V_L1_ATTRIBUTE_VALUE_DATE
END
