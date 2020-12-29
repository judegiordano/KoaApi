import time
from locust import HttpUser, task

class QuickstartUser(HttpUser):
    @task
    def get_by_id(self):
        self.client.get(url="/api/user/id/5")
