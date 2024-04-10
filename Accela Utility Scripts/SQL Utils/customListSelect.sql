   --(1)    Declare Table Name of the Custom List
   DECLARE @customListTable varchar(30) = 'STREET IMPROVEMENTS'

   --(2)    Agency ID/SERV PROV CODE
   DECLARE @servProvCode varchar(30) = 'Fontana'
   
   --(3)    Declare a variable for each column header in the custom list you would like to grab
   DECLARE @col1 varchar(20) = 'Amount'
   DECLARE @col2 varchar(20) = 'Item'
   DECLARE @col3 varchar(20) = 'Quantity'
   DECLARE @col4 varchar(20) = 'Unit'
   DECLARE @col5 varchar(20) = 'Unit Cost'

   
   
   Select 
   p.B1_ALT_ID
   ,b.TABLE_NAME
   ,b.ROW_INDEX,

   --(4)    rename the column output as needed below
   --       The MIN() function is not required and should be changed as needed
     Min(Case COLUMN_NAME When @col1 Then B.ATTRIBUTE_VALUE End) Amount,
     Min(Case COLUMN_NAME When @col2 Then B.ATTRIBUTE_VALUE End) [Item],
     Min(Case COLUMN_NAME When @col3 Then B.ATTRIBUTE_VALUE End) [Quantity],
     Min(Case COLUMN_NAME When @col4 Then B.ATTRIBUTE_VALUE End) [Unit],
     Min(Case COLUMN_NAME When @col5 Then B.ATTRIBUTE_VALUE End) [Unit Cost]

  FROM BAPPSPECTABLE_VALUE B 
		
		join B1PERMIT p on 1=1
		and b.B1_PER_ID1 = p.B1_PER_ID1
		and b.B1_PER_ID2 = p.B1_PER_ID2
		and b.B1_PER_ID3 = p.B1_PER_ID3

		where	1=1
		and B.TABLE_NAME = @customListTable
			and b.SERV_PROV_CODE = @servProvCode
		--	and p.B1_ALT_ID = '22TMP-000009'

   Group By b.table_name, p.B1_ALT_ID, b.ROW_INDEX