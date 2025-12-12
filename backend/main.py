from pyramid.config import Configurator
from backend.db import get_engine, get_session_factory, get_tm_session, Base 
from pyramid.response import Response
import backend.models.review 

def main(global_config, **settings):
    with Configurator(settings=settings) as config:
        engine = get_engine()
        
        Base.metadata.create_all(engine)
        
        session_factory = get_session_factory(engine)

        config.include('pyramid_tm')

        config.add_request_method(
            lambda r: get_tm_session(session_factory, r.tm),
            'dbsession',
            reify=True
        )
        
        #Setup Routes
        config.add_route('hello', '/')
        config.add_route('analyze_review', '/api/analyze-review')
        config.add_route('reviews', '/api/reviews')

        # Setup Views
        config.scan('backend.views') 
        
        # Setup CORS
        config.add_tween('backend.main.cors_tween_factory')

        return config.make_wsgi_app()

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        if request.method == 'OPTIONS':
            response = Response()
        else:
            response = handler(request)

        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        return response
    return cors_tween

if __name__ == '__main__':
    from wsgiref.simple_server import make_server
    app = main({})
    print("Server running on http://0.0.0.0:6543")
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()
