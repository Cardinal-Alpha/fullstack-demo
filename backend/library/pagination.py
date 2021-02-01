from rest_framework.pagination import PageNumberPagination


class PageSizedPagination(PageNumberPagination):
    page_size_query_param = 'size'