# OpenAI API Calling Commands

These are some methods to call the OpenAI API via `llm.arc.vt.edu` (from the docs on [llm.api.arc.vt.edu](https://www.docs.arc.vt.edu/ai/011_llm_api_arc_vt_edu.html))

## 1. Chat Completions

```bash
API_KEY="sk-YOUR-API-KEY"

curl -X POST "https://llm-api.arc.vt.edu/api/v1/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-oss-120b",
        "messages": [{
           "role":"user",
           "content":"Why is the sky blue?"
        }]
      }'
```

I believe this is a common method, one that we may need to employ, although I am unsure at the moment.

## 2. Document Upload

```bash
API_KEY="sk-YOUR-API-KEY"

curl -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Accept: application/json" \
  -F "file=@/path/to/file.pdf" https://llm-api.arc.vt.edu/api/v1/files/
```

Unlikely that we will use this one, but I have kept it here in case we want to send user related documents (owned games/dlcs, genres, tags, etc.).

## 3. Retrieval Augmented Generation (RAG)

This goes along with the previous calls, so they would be used in conjunction.

```bash
API_KEY="sk-YOUR-API-KEY"

## Upload document and get file ID
file_id=$(curl -s -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Accept: application/json" \
  -F "file=@document.pdf" \
  https://llm-api.arc.vt.edu/api/v1/files/ | jq -r '.id')

## Use the file ID in the request
request=$(jq -n \
  --arg model "gpt-oss-120b" \
  --arg file_id "$file_id" \
  --arg prompt "Create a summary of the document" \
  '{
    model: $model,
    messages: [{role: "user", content: $prompt}],
    files: [{type: "file", id: $file_id}]
  }')

## Make the chat completion request with the file
curl -X POST "https://llm-api.arc.vt.edu/api/v1/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$request"
```

## 4. Web Search

This is the one that I believe we will use the most, as we are going to be asking the model to some rather complicated searching based on a given input, search for games that fulfill the input, and then output its response in the desired format.

```bash
API_KEY="sk-YOUR-API-KEY"

curl -X POST "https://llm-api.arc.vt.edu/api/v1/chat/completions" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-oss-120b",
        "messages": [{
           "role":"user",
           "content":"Who is the US president right now?"          
        }],
        "tool_ids": ["server:websearch"]
      }'
```
