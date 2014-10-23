#!/bin/bash

set -e

REPOS_DIR=/etc/yum.repos.d

# Remove all old repository definitions
/bin/rm -rf $REPOS_DIR/*

# define internal repository
/bin/cat << EOF > $REPOS_DIR/internal.repo
[internal]
name=internal
baseurl=http://rpms.jpmchase.net/seurat/rpm/x86_64
enabled=1
gpgcheck=0
EOF

# yum install rubygems
# yum install rubygem-fpm
# yum install nodejs