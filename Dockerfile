# syntax=docker/dockerfile:1

# Create a stage for building the application.
ARG GO_VERSION=1.24.1
FROM  --platform=$BUILDPLATFORM golang:${GO_VERSION} AS build
WORKDIR /src

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /go/pkg/mod/ to speed up subsequent builds.
# Leverage bind mounts to go.sum and go.mod to avoid having to copy them into
# the container.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    go mod download -x

# This is the architecture you’re building for, which is passed in by the builder.
# Placing it here allows the previous steps to be cached across architectures.
ARG TARGETARCH

# Build the application.
# Leverage a cache mount to /go/pkg/mod/ to speed up subsequent builds.
# Leverage a bind mount to the current directory to avoid having to copy the
# source code into the container.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,target=. \
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server ./cmd


FROM --platform=$BUILDPLATFORM node:22-alpine AS frontend
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@10.0.0 --activate
WORKDIR /app
COPY ./web/package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=bind,source=./web/pnpm-lock.yaml,target=pnpm-lock.yaml \
    pnpm install --frozen-lockfile

COPY ./web .

RUN pnpm build


FROM alpine:latest AS final
WORKDIR /src

# Copy the executable from the "build" stage.
COPY --from=build /bin/server /src/

COPY --from=frontend /app/dist ./web/dist

# Expose the port that the application listens on.
EXPOSE 3000

# What the container should run when it is started.
CMD [ "./server" ]
