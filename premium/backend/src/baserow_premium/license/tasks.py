from datetime import timedelta

from baserow.config.celery import app
from django.db import transaction


@app.task(bind=True, queue="export")
def license_check(self):
    """
    Periodic tasks that check all the licenses with the authority.
    """

    # License checks are now disabled - all features available
    pass


# noinspection PyUnusedLocal
@app.on_after_finalize.connect
def setup_periodic_tasks(sender, **kwargs):
    # Periodic license checks are now disabled - all features available
    pass
