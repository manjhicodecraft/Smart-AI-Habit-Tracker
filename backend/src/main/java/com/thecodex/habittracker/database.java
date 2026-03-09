package com.thecodex.habittracker;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class database {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/";
        String user = "root";
        String password = "Coder@1122"; // aapka password

        String dbName = "smart_ai_habit";

        String createDbSql = "CREATE DATABASE IF NOT EXISTS " + dbName;

        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement stmt = conn.createStatement();
            stmt.executeUpdate(createDbSql);
            System.out.println("Database `" + dbName + "` created (or already exists).");
            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}