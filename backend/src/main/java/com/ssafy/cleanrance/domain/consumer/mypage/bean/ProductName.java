package com.ssafy.cleanrance.domain.consumer.mypage.bean;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductName {
    private String productImagefront;
    private String productName;
    private int productStock;
    private int productDiscountprice;
    private String productExpdate;
    private int bookStatus;
    private int basketCount;
}
