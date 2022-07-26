package moscode.osiekblinds.service;

public enum BlindDirection {
    UP("u"),
    DOWN("d");

    private final String code;

    BlindDirection(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
