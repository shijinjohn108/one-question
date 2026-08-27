/* Production data adapter. app.js remains a local demo until a config is supplied.
   These functions are the backend replacement points for its Store methods. */
window.OQBackend = (() => {
  const config = window.ONE_QUESTION_SUPABASE;
  if (!config?.url || config.url.includes('YOUR_PROJECT') || !window.supabase) return { enabled:false };
  const db = window.supabase.createClient(config.url, config.anonKey, { auth:{ persistSession:true, autoRefreshToken:true } });
  const call = async (promise) => { const {data,error}=await promise; if(error) throw error; return data; };
  return {
    enabled:true, db,
    signUp: (email,password,displayName) => call(db.auth.signUp({email,password,options:{data:{display_name:displayName},emailRedirectTo:`${window.location.origin}${window.location.pathname}`}})),
    signIn: (email,password) => call(db.auth.signInWithPassword({email,password})),
    signOut: () => call(db.auth.signOut()),
    session: () => db.auth.getSession(),
    myProfile: () => call(db.from('profiles').select('id,display_name,public_id,role,streak,created_at').single()),
    myAnswer: questionId => call(db.rpc('my_answer',{p_question_id:questionId})),
    today: () => call(db.from('questions').select('id,prompt,opens_at,closes_at,question_options(id,label,position)').eq('status','live').order('opens_at',{ascending:false}).limit(1).single()),
    answer: (questionId,optionId,userId) => call(db.from('answers').insert({question_id:questionId,option_id:optionId,user_id:userId})),
    results: questionId => call(db.rpc('question_results',{p_question_id:questionId})),
    comments: questionId => call(db.rpc('public_comments',{p_question_id:questionId})),
    addComment: (questionId,userId,body,parentId=null) => call(db.from('comments').insert({question_id:questionId,user_id:userId,body,parent_id:parentId})),
    toggleLike: async (commentId,userId) => {
      const existing=await call(db.from('comment_likes').select('comment_id').eq('comment_id',commentId).eq('user_id',userId).maybeSingle());
      return existing ? call(db.from('comment_likes').delete().eq('comment_id',commentId).eq('user_id',userId)) : call(db.from('comment_likes').insert({comment_id:commentId,user_id:userId}));
    },
    report: (commentId,userId,reason) => call(db.from('reports').insert({comment_id:commentId,reporter_id:userId,reason})),
    identityLookup: (publicId,reason) => call(db.rpc('admin_identity_lookup',{p_public_id:publicId,p_reason:reason}))
  };
})();
