jsDate = new Date();
aa.print(jsDate.getTime());
sysDate = aa.date.getCurrentDate().getEpochMilliseconds();
aa.print(sysDate);

var servProvCode = aa.getServiceProviderCode();
aa.print(servProvCode);


var LTimeZone = com.accela.aa.util.DateTimeUtil.getAgencyTimeZone(aa.getServiceProviderCode());
aa.print(LTimeZone);




aa.print("Agency Current Date: " + com.accela.aa.util.DateTimeUtil.getAgencyCurrentDate(aa.getServiceProviderCode()));
aa.print("JS Date Current    : " + new Date());
aa.print("JS Date Fix        : " + new Date(com.accela.aa.util.DateTimeUtil.getAgencyCurrentDate(aa.getServiceProviderCode()).getTime()));
aa.print("Java Date Current  : " + new java.util.Date());
aa.print("Java Date Fix      : " + new java.util.Date(com.accela.aa.util.DateTimeUtil.getAgencyCurrentDate(aa.getServiceProviderCode()).getTime()));
aa.print("Java Date Current  : " + java.util.Date());
aa.print("Java Date Fix      : " + java.util.Date(com.accela.aa.util.DateTimeUtil.getAgencyCurrentDate(aa.getServiceProviderCode()).getTime()));