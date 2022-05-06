package com.ssafy.cleanrance.domain.consumer.mypage.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.ssafy.cleanrance.domain.consumer.mypage.db.entity.Book;
import com.ssafy.cleanrance.domain.consumer.mypage.db.repository.BookRepositorySupport;
import org.apache.commons.io.FileUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service("consumerService")
public class ConsumerServiceImpl implements ConsumerService{
    @Autowired
    BookRepositorySupport bookRepositorySupport;
//    @Override
//    public List<Book> findBookByuserId(String userId) {
//        return bookRepositorySupport.findBookByuserId(userId);
//    }

//    @Override
//    public List<Book> findBookByDate(String userId, String date) {
//        return null;
//    }

    @Override
    public String findBookByUserIdAndBookSet(String userId, int bookSet) throws IOException, WriterException {
        QRCodeWriter writer = new QRCodeWriter();
        List<Book> list = bookRepositorySupport.findBookByuserIdAndbookSet(userId, bookSet);
        //QR코드에 담고 싶은 정보를 문자열로 표시
        String codeInformation = null;
//        codeInformation = "구매자 아이디: "+list.get(0).getUserId() +"\n";
        codeInformation = "https://k6e203.p.ssafy.io/";
        System.out.println(list.get(0).getUserId());
        codeInformation = new String(codeInformation.getBytes("UTF-8"),"ISO-8859-1");
        BitMatrix matrix = writer.encode(codeInformation, BarcodeFormat.QR_CODE, 200,200);
        BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(matrix);
        File QRImg = new File("qr.png");
        ImageIO.write(qrImage, "png", QRImg);
        byte[] byteArr = FileUtils.readFileToByteArray(QRImg);
        String base64 = "data:image/jpeg;base64," + new Base64().encodeToString(byteArr);
        return base64;
    }
}
