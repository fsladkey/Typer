class JbuilderTemplate < Jbuilder
  class << self
    attr_accessor :template_lookup_options
  end

  self.template_lookup_options = { handlers: [:jbuilder] }

  def initialize(context, *args)
    @context = context
    super(*args)
  end

  def partial!(*args)
    if args.one? && _is_active_model?(args.first)
      _render_active_model_partial args.first
    else
      _render_explicit_partial(*args)
    end
  end

  def cache!(key=nil, options={})
    if @context.controller.perform_caching
      value = _cache_fragment_for(key, options) do
        _scope { yield self }
      end

      merge! value
    else
      yield
    end
  end

  #
  #
  def cache_if!(condition, *args)
    condition ? cache!(*args, &::Proc.new) : yield
  end

  def array!(collection = [], *args)
    options = args.first

    if args.one? && _partial_options?(options)
      partial! options.merge(collection: collection)
    else
      super
    end
  end

  def set!(name, object = BLANK, *args)
    options = args.first

    if args.one? && _partial_options?(options)
      _set_inline_partial name, object, options
    else
      super
    end
  end

  private

  def _render_partial_with_options(options)
    options.reverse_merge! locals: {}
    options.reverse_merge! ::JbuilderTemplate.template_lookup_options
    as = options[:as]

    if as && options.key?(:collection)
      as = as.to_sym
      collection = options.delete(:collection)
      locals = options.delete(:locals)
      array! collection do |member|
        member_locals = locals.clone
        member_locals.merge! collection: collection
        member_locals.merge! as => member
        _render_partial options.merge(locals: member_locals)
      end
    else
      _render_partial options
    end
  end

  def _render_partial(options)
    options[:locals].merge! json: self
    @context.render options
  end

  def _cache_fragment_for(key, options, &block)
    key = _cache_key(key, options)
    _read_fragment_cache(key, options) || _write_fragment_cache(key, options, &block)
  end

  def _read_fragment_cache(key, options = nil)
    @context.controller.instrument_fragment_cache :read_fragment, key do
      ::Rails.cache.read(key, options)
    end
  end

  def _write_fragment_cache(key, options = nil)
    @context.controller.instrument_fragment_cache :write_fragment, key do
      yield.tap do |value|
        ::Rails.cache.write(key, value, options)
      end
    end
  end

  def _cache_key(key, options)
    name_options = options.slice(:skip_digest, :virtual_path)
    key = _fragment_name_with_digest(key, name_options)

    if @context.respond_to?(:fragment_cache_key)
      key = @context.fragment_cache_key(key)
    else
      key = url_for(key).split('://', 2).last if ::Hash === key
    end

    ::ActiveSupport::Cache.expand_cache_key(key, :jbuilder)
  end

  def _fragment_name_with_digest(key, options)
    if @context.respond_to?(:cache_fragment_name)
      @context.cache_fragment_name(key, options)
    elsif @context.respond_to?(:fragment_name_with_digest)
      @context.fragment_name_with_digest(key)
    else
      key
    end
  end

  def _partial_options?(options)
    ::Hash === options && options.key?(:as) && options.key?(:partial)
  end

  def _is_active_model?(object)
    object.class.respond_to?(:model_name) && object.respond_to?(:to_partial_path)
  end

  def _set_inline_partial(name, object, options)
    value = if object.nil?
      []
    elsif _is_collection?(object)
      _scope{ _render_partial_with_options options.merge(collection: object) }
    else
      locals = ::Hash[options[:as], object]
      _scope{ _render_partial options.merge(locals: locals) }
    end

    set! name, value
  end

  def _render_explicit_partial(name_or_options, locals = {})
    case name_or_options
    when ::Hash
      options = name_or_options
    else
      if locals.one? && (locals.keys.first == :locals)
        options = locals.merge(partial: name_or_options)
      else
        options = { partial: name_or_options, locals: locals }
      end
      as = locals.delete(:as)
      options[:as] = as if as.present?
      options[:collection] = locals[:collection] if locals.key?(:collection)
    end

    _render_partial_with_options options
  end

  def _render_active_model_partial(object)
    @context.render object, json: self
  end
end