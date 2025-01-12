package dev.andriiseleznov.java_book_tracker_backend.Book;


public class SearchRequest {

    private String login;
    private String password;
    private String keyword;
    private int shelfGroupIndex;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public int getShelfGroupIndex() {
        return shelfGroupIndex;
    }

    public void setShelfGroupIndex(int shelfGroupIndex) {
        this.shelfGroupIndex = shelfGroupIndex;
    }

}
