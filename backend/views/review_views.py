from pyramid.view import view_config
from pyramid.response import Response
from backend.models.review import Review
from backend.services.ai_service import analyze_review
import json

@view_config(route_name='hello', request_method='GET')
def hello_world(request):
    return Response('Backend Product Analyzer is Running! (Now with DB & AI)')

@view_config(route_name='reviews', request_method='POST', renderer='json')
def create_review(request):
    try:
        payload = request.json_body
        required_fields = ['product_name', 'review_text', 'rating']
        for field in required_fields:
            if field not in payload:
                request.response.status = 400
                return {'error': f'Field {field} wajib diisi'}

        # Simpan pakai request.dbsession
        new_review = Review(
            product_name=payload['product_name'],
            review_text=payload['review_text'],
            rating=int(payload['rating'])
        )

        request.dbsession.add(new_review)
        request.dbsession.flush() # Dapat ID sementara

        request.response.status = 201
        return {
            'message': 'Review berhasil disimpan',
            'id': new_review.id
        }
    except Exception as e:
        request.response.status = 500
        return {'error': f'Database Error: {str(e)}'}

@view_config(route_name='analyze_review', request_method='POST', renderer='json')
def analyze_review_endpoint(request):
    try:
        data = request.json_body
        text = data.get('review_text')
        product = data.get('product_name', 'Unknown Product')
        
        if not text:
            request.response.status = 400
            return {'error': 'Review text is required'}

        ai_result = analyze_review(text)

        final_rating = ai_result['rating']
        if final_rating == 0:
            if ai_result['sentiment_label'] == 'POSITIVE':
                final_rating = 4
            elif ai_result['sentiment_label'] == 'NEGATIVE':
                final_rating = 2
            else:
                final_rating = 3
        
        new_review = Review(
            product_name=product,
            review_text=text,
            sentiment_label=ai_result['sentiment_label'],
            sentiment_score=ai_result['sentiment_score'],
            key_points=ai_result['key_points'],
            rating=final_rating
        )
        
        request.dbsession.add(new_review)

        request.dbsession.flush()

        request.dbsession.refresh(new_review)
        
        return {
            "message": "Success",
            "data": new_review.to_dict()
        }
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}

@view_config(route_name='reviews', request_method='GET', renderer='json')
def get_reviews_endpoint(request):
    try:
        reviews = request.dbsession.query(Review).order_by(Review.created_at.desc()).all()
        return [r.to_dict() for r in reviews]
    except Exception as e:
        request.response.status = 500
        return {'error': str(e)}
