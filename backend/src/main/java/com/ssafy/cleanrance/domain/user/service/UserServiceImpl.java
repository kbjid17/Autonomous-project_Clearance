package com.ssafy.cleanrance.domain.user.service;
import com.ssafy.cleanrance.domain.user.db.entity.Location;
import com.ssafy.cleanrance.domain.user.db.entity.User;
import com.ssafy.cleanrance.domain.user.db.repository.LocationRepository;
import com.ssafy.cleanrance.domain.user.db.repository.UserRepository;
import com.ssafy.cleanrance.domain.user.db.repository.UserRepositorySupport;
import com.ssafy.cleanrance.domain.user.request.StoreSignUpRequest;
import com.ssafy.cleanrance.domain.user.request.UserPutRequest;
import com.ssafy.cleanrance.domain.user.request.UserSignUpRequest;
import com.ssafy.cleanrance.global.util.ImageUtil;
import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

import java.net.MalformedURLException;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Optional;

@Service("userService")
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepositorySupport userRepositorySupport;
    @Autowired
    UserRepository userRepository;
    @Autowired
    LocationRepository locationRepository;
    @Lazy
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public String createStore(StoreSignUpRequest storeSignUpRequest, MultipartFile image) throws IOException {
        Optional<User> check = userRepository.findById(storeSignUpRequest.getUser_id());
        check.ifPresent(checkUser -> {
            throw  new IllegalStateException("?????? ???????????? ???????????????.");
        });
        User user = new User();
        user.setUserId(storeSignUpRequest.getUser_id());
        user.setUserName(storeSignUpRequest.getUser_name());
        user.setUserRole(2);
        user.setUserName(storeSignUpRequest.getUser_name());
        user.setUserPassword(passwordEncoder.encode(storeSignUpRequest.getUser_password()));
        user.setUserEmail(storeSignUpRequest.getUser_email());
        user.setUserPhone(storeSignUpRequest.getUser_phone());
        user.setUserAddress(storeSignUpRequest.getUser_address());
        LocalDateTime time = LocalDateTime.now();
        user.setUserJoindate(time);
        user.setUserLicensenum(storeSignUpRequest.getUser_licensenum());
        //????????? Base64 ????????? ????????? ??????
        if(image != null){
            MultipartFile mfile = image;
            File file = ImageUtil.multipartFileToFile(mfile);
            byte[] byteArr = FileUtils.readFileToByteArray(file);
            String base64 = "data:image/jpeg;base64," + new Base64().encodeToString(byteArr);
            System.out.println(base64);
            //???????????? ????????? userImage ??????
            user.setUserImage(base64);
        }else{
            File defaultStore = new File("src\\main\\resources\\img\\default_store.png");
            byte[] byteArr = FileUtils.readFileToByteArray(defaultStore);
            String base64 = "data:image/jpeg;base64," + new Base64().encodeToString(byteArr);
            user.setUserImage(base64);
        }
        //?????? ????????? ?????? ?????? ??????
        Location loc = addressToLngLat(user.getUserAddress(), user.getUserId());
        userRepository.save(user);
        locationRepository.save(loc);

        return "OK";
    }

    @Override
    public String createUser(UserSignUpRequest userSignUpRequest, MultipartFile image) throws IOException {
        Optional<User> check = userRepository.findById(userSignUpRequest.getUser_id());
        check.ifPresent(checkUser -> {
            throw  new IllegalStateException("?????? ???????????? ???????????????.");
        });
        User user = new User();
        user.setUserId(userSignUpRequest.getUser_id());
        user.setUserRole(3);
        user.setUserName(userSignUpRequest.getUser_name());
        user.setUserPassword(passwordEncoder.encode(userSignUpRequest.getUser_password()));
        user.setUserEmail(userSignUpRequest.getUser_email());
        user.setUserPhone(userSignUpRequest.getUser_phone());
        user.setUserAddress(userSignUpRequest.getUser_address());
        LocalDateTime time = LocalDateTime.now();
        user.setUserJoindate(time);
        if(image != null){
            //????????? Base64 ????????? ????????? ??????
            MultipartFile mfile = image;
            File file = ImageUtil.multipartFileToFile(mfile);
            //?????? ?????? ??????
            // read an image to BufferedImage for processing
            BufferedImage originImage = ImageIO.read(file);
            int type = originImage.getType() == 0 ? BufferedImage.TYPE_INT_ARGB : originImage.getType();
            BufferedImage resizeImg = resizeImage(originImage, type);
            File resizeFile = new File("saved.png");
            ImageIO.write(resizeImg, "png", resizeFile);
            //end ?????? ?????? ??????
            byte[] byteArr = FileUtils.readFileToByteArray(resizeFile);
            String base64 = "data:image/jpeg;base64," + new Base64().encodeToString(byteArr);
            System.out.println(base64);
            //???????????? ????????? userImage ??????
            user.setUserImage(base64);
        }else{
            File defaultStore = new File("src\\main\\resources\\img\\default_user.png");
            byte[] byteArr = FileUtils.readFileToByteArray(defaultStore);
            String base64 = "data:image/jpeg;base64," + new Base64().encodeToString(byteArr);
            user.setUserImage(base64);
        }
        userRepository.save(user);
        return "OK";
    }

    @Override
    public Optional<User> findById(String userId) {
        Optional<User> user = userRepository.findById(userId);
        return user;
    }


    @Override
    public Optional<User> updateUser(UserPutRequest user) {
        Optional<User> updateUser = userRepository.findById(user.getUser_id());
//       ??????,?????????,????????????, ?????? ??????
        updateUser.ifPresent(selectUser -> {
            selectUser.setUserEmail(user.getUser_email());
            selectUser.setUserPhone(user.getUser_phone());
            selectUser.setUserName(user.getUser_name());
            if(selectUser.getUserRole() == 2){
                if(selectUser.getUserAddress() != user.getUser_address()){
                    Location loc = locationRepository.findByuserId(selectUser.getUserId());
                    Location location = addressToLngLat(user.getUser_address(), selectUser.getUserId());
                    loc.setLocationXpoint(location.getLocationXpoint());
                    loc.setLocationYpoint(location.getLocationYpoint());
                    locationRepository.save(loc);
                }
            }
            selectUser.setUserAddress(user.getUser_address());
            userRepository.save(selectUser);
        });
        return updateUser;
    }

    @Override
    public String deleteUser(String userId) {
        Optional<User> user = userRepository.findById(userId);
        System.out.println(user);
        userRepository.deleteById(userId);
        return "OK";
    }

    private BufferedImage resizeImage(BufferedImage origin, int type) {
        BufferedImage resizeImg = new BufferedImage(100, 100, type);
        Graphics2D graphics2D = resizeImg.createGraphics();
        graphics2D.drawImage(origin, 0, 0, 100, 100, null);
        graphics2D.dispose();
        graphics2D.setComposite(AlphaComposite.Src);
        //?????? ??????
        graphics2D.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        //?????????
        graphics2D.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_SPEED);
        //?????????????????? ??????
        graphics2D.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        return resizeImg;
    }

    private Location addressToLngLat(String address, String userId) {
        //?????? ????????? ?????? ?????? ??????
        String APIKey = "162a4b2b1191ced1dc56afc5f9bbde83";
        String URL = "http://dapi.kakao.com/v2/local/search/address.json?query=";
        String jsonString = null;
        String addr = address;
        Location location = new Location();
        try {
            addr = URLEncoder.encode(address, "UTF-8");
            String juso = URL + addr;
            URL url = new URL(juso);
            URLConnection conn = url.openConnection();
            conn.setRequestProperty("Authorization", "KakaoAK " + APIKey);
            //?????? ?????? json????????????
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
            //String Buffer??? ??????
            StringBuffer docJson = new StringBuffer();
            String line;
            while ((line = br.readLine()) != null) {
                docJson.append(line);
            }
            br.close();
            //JSONObject??? ??????
            JSONObject jsonObject = new JSONObject(docJson.toString());
            //documents??? meta ????????? ????????? x,y??? ???????????? documents????????????
            JSONArray jsonArray = (JSONArray) jsonObject.get("documents");
            JSONObject tempObj = (JSONObject) jsonArray.get(0);
            System.out.println("lat : " + tempObj.getDouble("y"));
            System.out.println("lng : " + tempObj.getDouble("x"));
            double y = tempObj.getDouble("y");
            double x = tempObj.getDouble("x");
            location.setLocationXpoint(x);
            location.setLocationYpoint(y);
            location.setUserId(userId);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return location;
    }
}
