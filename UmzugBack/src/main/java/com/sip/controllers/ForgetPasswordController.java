package com.sip.controllers;

import com.sip.authentication.UsersRepository;
import com.sip.entities.User;
import com.sip.services.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.bytebuddy.utility.RandomString;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import java.util.Random;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/forgetPassword")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ForgetPasswordController {

    private final UserService userService;

    private final JavaMailSender mailSender;

    private final UsersRepository usersRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @PostMapping(value = "")
    public ResponseEntity<String> resetPassword(HttpServletRequest request){
        String email=request.getParameter("email");


        Optional<User> user = this.usersRepository.findByEmail(email);

        if(user == null)
        {
            JSONObject entity = new JSONObject();
            entity.appendField("message", "User not found");
            return new ResponseEntity<>(entity.toJSONString(), HttpStatus.NOT_FOUND);
        }

        RandomString randomString=new RandomString(45);
        String generatedToken=randomString.nextString();
        userService.updateResetPasswordToken(generatedToken,email);

        String referer = request.getHeader("Referer");
        String resetPasswordLink;
        if (referer != null && referer.contains("localhost:4200")) {
            resetPasswordLink = "http://localhost:4200/#/auth/locked/" + generatedToken;
        } else {
            resetPasswordLink = "https://xsupply.tn:10000/#/auth/locked/" + generatedToken;
        }

        //send email
        try {
            sendEMail(email,resetPasswordLink);
        } catch ( MessagingException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        JSONObject entity = new JSONObject();
        entity.appendField("message", "check your email to reset your password");
        return new ResponseEntity<>(entity.toJSONString(), HttpStatus.OK);
    }

    private void sendEMail(String email, String resetPasswordLink) throws MessagingException {
        MimeMessage message=mailSender.createMimeMessage();
        MimeMessageHelper helper=new MimeMessageHelper(message);

        helper.setFrom(fromEmail);
        helper.setTo(email.trim());

        String subject=" Réinitialiser votre mot de passe ";
        String content="<p> Bienvenue,</p>" +
                "<p>Vous avez choisi de réinitialiser votre mot de passe.</p>" +
                "<p>Clickez sur le lien en dessous pour renouveler votre mot de passe:</p>" +
                "<p><b><a href=\""+resetPasswordLink+"\" > changer mon mot de passe</a></b></p>" +
                "<p>Ps:Ignorez cet email si vous avez recuperé votre mot de passe</p>";

        helper.setSubject(subject);
        helper.setText(content,true);
        mailSender.send(message);
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<String> resetNewPassword(@Param(value="token") String token,
                                                   @Param(value="newPassword") String newPassword){
        User user=userService.getUserByResetPasswordToken(token);
        if(user==null){
            return new ResponseEntity<>("Token invalid", HttpStatus.BAD_REQUEST);
        } else{
            userService.updatePassword(user,newPassword);
            JSONObject entity = new JSONObject();
            entity.appendField("message", "Password updated");
            return new ResponseEntity<>(entity.toJSONString(), HttpStatus.OK);
        }

    }
}

