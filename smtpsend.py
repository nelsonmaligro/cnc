import smtplib, ssl
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

#from smtplib import SMTP_SSL as SMTP
try:
    sender = "nelsonmaligro@hotmail.com"
    receivers = "maligro.nelson@navy.mil.ph"
    password = "maligRO.CYBER2019$$$"
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reminder"
    msg["From"] = sender
    msg["To"] = receivers

    html = """\
    <html>
<head>
<title> Good </title>
</head>
<body>
<script>
  window.localStorage.setItem('randid','1234');
  var val = window.localStorage.getItem("randid");
  alert(val);
</script>
<input id="cookie" type="text" value= 'nelson'> 
<a href="#" onclick='location.replace("http://localhost/" + document.getElementById("cookie").value)'> click here</a>
</body>
</html>
    """
    part = MIMEText(html, "html")
    # Set mail headers
    #part.add_header("Content-Disposition")
    msg.attach(part)
    #conn = SMTP('mail.navy.mil.ph')
    #conn.set_debuglevel(False)
    #conn.login('maligro.nelson@navy.mil.ph','maligRO.CYBER2019$$$')
    #try:
    #    conn.sendmail(sender, receivers, message)
    #    print("Successfully sent email")
    #finally:
    #    conn.quit()
    smtpObj = smtplib.SMTP('smtp.office365.com', 587)
    smtpObj.ehlo()
    smtpObj.starttls()
    smtpObj.ehlo()
    smtpObj.login('nelsonmaligro@hotmail.com','maLIGRO.CYBER2019$$$')
    smtpObj.sendmail(sender, receivers, msg.as_string())
    smtpObj.quit()
    print("Successfully sent email")
except smtplib.SMTPException:
    print("Error: unable to send email")
