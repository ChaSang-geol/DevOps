from fastapi import FastAPI

app = FastAPI(title="Python development")


@app.get("/")
def hello():
    return {"service": "Python", "data_directory": "/data"}
